import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Dashboard from "./pages/Dashboard";
import Pacientes from "./pages/Pacientes";
import Agendamentos from "./pages/Agendamentos";
import Telemedicina from "./pages/Telemedicina";
import Prontuarios from "./pages/Prontuarios";
import Profissionais from "./pages/Profissionais";
import Relatorios from "./pages/Relatorios";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <main className="flex-1 p-6 lg:p-8 bg-background overflow-auto">
              <SidebarTrigger className="mb-4" />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/pacientes" element={<Pacientes />} />
                <Route path="/agendamentos" element={<Agendamentos />} />
                <Route path="/telemedicina" element={<Telemedicina />} />
                <Route path="/prontuarios" element={<Prontuarios />} />
                <Route path="/profissionais" element={<Profissionais />} />
                <Route path="/relatorios" element={<Relatorios />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
