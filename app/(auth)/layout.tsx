export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <div className="flex items-center justify-center h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
