import AppBreadCrumb from "@/components/app-breadcrumb";
import AppNavbar from "@/components/app-navbar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster"


export default function DasboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="mx-auto min-h-screen w-full">
        <AppNavbar />
        <div className="mx-5">
          <AppBreadCrumb />
          {children}
          <Toaster />
        </div>
      </main>
    </SidebarProvider>
  );
}
