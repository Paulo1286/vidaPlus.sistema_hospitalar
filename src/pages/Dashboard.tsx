import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Activity, TrendingUp, Bell, Video, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { usePacientes } from "@/hooks/usePacientes";
import { useAgendamentos } from "@/hooks/useAgendamentos";
import { useTelemedicina } from "@/hooks/useTelemedicina";
import { useProfissionais } from "@/hooks/useProfissionais";

export default function Dashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { pacientes } = usePacientes();
  const { agendamentos } = useAgendamentos();
  const { consultas } = useTelemedicina();
  const { profissionais } = useProfissionais();

  const todayAppointments = agendamentos.filter(a => 
    new Date(a.data_hora).toDateString() === new Date().toDateString()
  );

  const todayTelemedicinas = consultas.filter(t => 
    new Date(t.data_hora).toDateString() === new Date().toDateString()
  );

  const pendingAppointments = todayAppointments.filter(a => a.status === "Aguardando").length;
  const taxaOcupacao = Math.round((todayAppointments.length / (profissionais.length * 8)) * 100);


  const handleQuickAction = (action: string, route: string) => {
    toast({
      title: action,
      description: "Redirecionando...",
    });
    navigate(route);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Visão geral do sistema VidaPlus</p>
        </div>
        <Button 
          className="bg-gradient-primary"
          onClick={() => toast({
            title: "Notificações",
            description: "Você tem 5 novas notificações",
          })}
        >
          <Bell className="w-4 h-4 mr-2" />
          Notificações
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Pacientes"
          value={pacientes.length.toString()}
          icon={Users}
          trend="Total cadastrados"
          trendUp={true}
          variant="primary"
        />
        <StatCard
          title="Consultas Hoje"
          value={todayAppointments.length.toString()}
          icon={Calendar}
          trend={`${pendingAppointments} pendentes`}
          variant="secondary"
        />
        <StatCard
          title="Teleconsultas"
          value={todayTelemedicinas.length.toString()}
          icon={Video}
          trend="Agendadas hoje"
          trendUp={true}
        />
        <StatCard
          title="Taxa de Ocupação"
          value={`${taxaOcupacao}%`}
          icon={Activity}
          trend="Hoje"
          trendUp={true}
        />
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Appointments */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Próximos Agendamentos
                </CardTitle>
                <CardDescription>Consultas e procedimentos do dia</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/agendamentos")}
              >
                Ver todos
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAppointments.slice(0, 3).map((agendamento) => {
                const paciente = pacientes.find(p => p.id === agendamento.paciente_id);
                const profissional = profissionais.find(p => p.id === agendamento.profissional_id);
                const dataHora = new Date(agendamento.data_hora);
                
                return (
                  <div
                    key={agendamento.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => navigate("/agendamentos")}
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{paciente?.nome}</p>
                      <p className="text-sm text-muted-foreground">{profissional?.nome}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">
                        {dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-sm text-muted-foreground">{agendamento.tipo}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-secondary" />
                  Atividades Recentes
                </CardTitle>
                <CardDescription>Últimas atualizações do sistema</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toast({
                  title: "Todas as atividades",
                  description: "Visualizando histórico completo",
                })}
              >
                Ver todas
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agendamentos.slice(0, 3).map((agendamento) => {
                const paciente = pacientes.find(p => p.id === agendamento.paciente_id);
                const diffMinutes = Math.floor((Date.now() - new Date(agendamento.created_at).getTime()) / 60000);
                const timeAgo = diffMinutes < 60 ? `há ${diffMinutes} min` : `há ${Math.floor(diffMinutes / 60)}h`;
                
                return (
                  <div
                    key={agendamento.id}
                    className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-secondary mt-2" />
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">Agendamento: {agendamento.tipo}</p>
                      <p className="text-sm text-muted-foreground">{paciente?.nome}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{timeAgo}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            Ações Rápidas
          </CardTitle>
          <CardDescription>Acesse funcionalidades frequentes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 py-4 hover:bg-primary-light hover:text-primary hover:border-primary"
              onClick={() => handleQuickAction("Novo Agendamento", "/agendamentos")}
            >
              <Calendar className="w-6 h-6" />
              <span>Novo Agendamento</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 py-4 hover:bg-primary-light hover:text-primary hover:border-primary"
              onClick={() => handleQuickAction("Cadastrar Paciente", "/pacientes")}
            >
              <Users className="w-6 h-6" />
              <span>Cadastrar Paciente</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 py-4 hover:bg-primary-light hover:text-primary hover:border-primary"
              onClick={() => handleQuickAction("Iniciar Teleconsulta", "/telemedicina")}
            >
              <Video className="w-6 h-6" />
              <span>Iniciar Teleconsulta</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 py-4 hover:bg-primary-light hover:text-primary hover:border-primary"
              onClick={() => handleQuickAction("Gerar Relatório", "/relatorios")}
            >
              <FileText className="w-6 h-6" />
              <span>Gerar Relatório</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
