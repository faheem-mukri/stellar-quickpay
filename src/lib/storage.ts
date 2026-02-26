// =====================================================
// storage.ts
// Manages groups and expenses in localStorage.
// Groups are the "bill splitting" sessions.
// Expenses are individual costs within a group.
// Settlements are on-chain via the contract.
// =====================================================

export type Member = {
  address: string;
  name: string; // short display name
};

export type Expense = {
  id: string;
  description: string;
  amount: number; // in XLM
  paidBy: string; // address
  splitAmong: string[]; // addresses
  createdAt: number;
};

export type Settlement = {
  id: string;
  from: string; // address
  to: string; // address
  amount: number;
  txHash: string;
  createdAt: number;
};

export type Group = {
  id: string;
  name: string;
  description: string;
  members: Member[];
  expenses: Expense[];
  settlements: Settlement[];
  createdAt: number;
  createdBy: string; // address
};

// ── Group CRUD ──────────────────────────────────────

export function getGroups(): Group[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("stellarsplit:groups") || "[]");
  } catch {
    return [];
  }
}

export function getGroup(id: string): Group | null {
  return getGroups().find((g) => g.id === id) ?? null;
}

export function saveGroup(group: Group): void {
  const groups = getGroups();
  const index = groups.findIndex((g) => g.id === group.id);
  if (index >= 0) {
    groups[index] = group;
  } else {
    groups.push(group);
  }
  localStorage.setItem("stellarsplit:groups", JSON.stringify(groups));
}

export function createGroup(
  name: string,
  description: string,
  creatorAddress: string,
  creatorName: string
): Group {
  const group: Group = {
    id: `group_${Date.now()}`,
    name,
    description,
    members: [{ address: creatorAddress, name: creatorName }],
    expenses: [],
    settlements: [],
    createdAt: Date.now(),
    createdBy: creatorAddress,
  };
  saveGroup(group);
  return group;
}

export function addMember(groupId: string, member: Member): Group | null {
  const group = getGroup(groupId);
  if (!group) return null;
  if (group.members.find((m) => m.address === member.address)) return group;
  group.members.push(member);
  saveGroup(group);
  return group;
}

// ── Expense CRUD ────────────────────────────────────

export function addExpense(
  groupId: string,
  expense: Omit<Expense, "id" | "createdAt">
): Group | null {
  const group = getGroup(groupId);
  if (!group) return null;
  group.expenses.push({
    ...expense,
    id: `exp_${Date.now()}`,
    createdAt: Date.now(),
  });
  saveGroup(group);
  return group;
}

// ── Balance Calculation ─────────────────────────────

export type Balance = {
  address: string;
  name: string;
  paid: number;   // total they paid
  owes: number;   // total they owe
  net: number;    // positive = owed money, negative = owes money
};

export function calculateBalances(group: Group): Balance[] {
  const balanceMap: Record<string, Balance> = {};

  // Initialize all members
  for (const member of group.members) {
    balanceMap[member.address] = {
      address: member.address,
      name: member.name,
      paid: 0,
      owes: 0,
      net: 0,
    };
  }

  // Process each expense
  for (const expense of group.expenses) {
    const share = expense.amount / expense.splitAmong.length;

    // Person who paid gets credited
    if (balanceMap[expense.paidBy]) {
      balanceMap[expense.paidBy].paid += expense.amount;
      balanceMap[expense.paidBy].net += expense.amount;
    }

    // Everyone who owes gets debited their share
    for (const address of expense.splitAmong) {
      if (balanceMap[address]) {
        balanceMap[address].owes += share;
        balanceMap[address].net -= share;
      }
    }
  }

  // Account for settlements
  for (const settlement of group.settlements) {
    if (balanceMap[settlement.from]) {
      balanceMap[settlement.from].net += settlement.amount;
    }
    if (balanceMap[settlement.to]) {
      balanceMap[settlement.to].net -= settlement.amount;
    }
  }

  return Object.values(balanceMap);
}

// ── Settlement Suggestion ───────────────────────────

export type SettlementSuggestion = {
  from: string;
  fromName: string;
  to: string;
  toName: string;
  amount: number;
};

export function suggestSettlements(group: Group): SettlementSuggestion[] {
  const balances = calculateBalances(group);
  const suggestions: SettlementSuggestion[] = [];

  const debtors = balances
    .filter((b) => b.net < -0.001)
    .sort((a, b) => a.net - b.net);

  const creditors = balances
    .filter((b) => b.net > 0.001)
    .sort((a, b) => b.net - a.net);

  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.min(Math.abs(debtor.net), creditor.net);

    if (amount > 0.001) {
      suggestions.push({
        from: debtor.address,
        fromName: debtor.name,
        to: creditor.address,
        toName: creditor.name,
        amount: Math.round(amount * 10000000) / 10000000,
      });
    }

    debtor.net += amount;
    creditor.net -= amount;

    if (Math.abs(debtor.net) < 0.001) i++;
    if (creditor.net < 0.001) j++;
  }

  return suggestions;
}

export function addSettlement(groupId: string, settlement: Omit<Settlement, "id" | "createdAt">): Group | null {
  const group = getGroup(groupId);
  if (!group) return null;
  group.settlements.push({
    ...settlement,
    id: `settle_${Date.now()}`,
    createdAt: Date.now(),
  });
  saveGroup(group);
  return group;
}