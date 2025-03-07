import type { Metadata } from "next";
import "./globals.css";
import UserProvide  from "../components/UserProvide";

export const metadata: Metadata = {
  title: "Manajemen Proyek",
  description: "Leavenoctagramglobal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <UserProvide>{children}</UserProvide>
      </body>
    </html>
  );
}
