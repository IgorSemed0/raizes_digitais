import NavegadorLateral from "@/components/navegadorLateral";
import NavbarCentral from "@/components/navbarCentral";
import NavbarDesktop from "@/components/navbarDesktop";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Background enhancements (grade sutil + gradiente) */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-600/10 via-transparent to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(16,185,129,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.15) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
      </div>

      {/* Sidebar Desktop */}
      <div className="hidden md:flex fixed left-0 top-0 h-full z-40">
        <NavegadorLateral />
      </div>

      {/* Navbar Desktop */}
      <div className="hidden md:block fixed top-0 left-20 right-0 z-30">
        <NavbarDesktop />
      </div>

      {/* Navbar Mobile */}
      <div className="fixed top-0 left-0 right-0 z-40 md:hidden">
        <NavbarCentral />
      </div>
      
      {/* Conteúdo Principal */}
      <div className="flex-1 md:ml-20 w-full">
        <main className="min-h-screen w-full">
          {/* Espaço para navbar mobile */}
          <div className="md:hidden h-16" />
          
          {/* Espaço para navbar desktop */}
          <div className="hidden md:block h-16" />
          
          {/* Conteúdo com scroll - CORREÇÃO AQUI */}
          <div className="w-full h-[calc(100vh-4rem)] overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}