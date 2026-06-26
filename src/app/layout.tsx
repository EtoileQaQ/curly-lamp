import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Echo — La page blanche du lundi, c'est terminé.",
  description:
    "Echo - L'IA qui t'aide à ne plus chercher quoi publier sur LinkedIn.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="fr" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
  (function() {
    const theme = localStorage.getItem('echo-theme');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    
    if (theme === 'dark' || 
       (theme === 'system' && prefersDark) ||
       (!theme && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  })();
`,
            }}
          />
        </head>
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
