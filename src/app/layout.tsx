import type { Metadata } from "next";
import { Montserrat, Fira_Code } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ProductMutationProvider } from "@/context/ProductMutationContext";
import { ThemeProvider } from "@/components/theme-provider";

const fontSans = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Fira_Code({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "StockPulse | Modern Product Management Dashboard",
  description: "Production-ready product management dashboard with real-time filters, search, and inventory tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontMono.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="producthub_theme"
          disableTransitionOnChange
        >
          <AuthProvider>
            <ProductMutationProvider>
              {children}
            </ProductMutationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
