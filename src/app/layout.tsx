import { ReactQueryProvider } from "@/components/ReactQueryProvider";
import "./globals.css";
import "./responsive.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* ✅ All pages now have React Query context */}
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}