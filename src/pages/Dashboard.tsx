import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Activity, TrendingUp, Bell, Video, FileText } from "lucide-react";

export default function Dashboard() {
  const upcomingAppointments = [
    { id: 1, patient: "Maria Silva", doctor: "Dr. João Santos", time: "09:00", type: "Consulta" },
    { id: 2, patient: "Pedro Oliveira", doctor: "Dra. Ana Costa", time: "10:30", type: "Retorno" },
    { id: 3, patient: "Carla Santos", doctor: "Dr. Paulo Lima", time: "14:00", type: "Exame" },
  ];

  const recentActivities = [
    { id: 1, action: "Nova consulta agendada", patient: "Lucas Ferreira", time: "há 5 min" },
    { id: 2, action: "Prontuário atualizado", patient: "Ana Paula", time: "há 15 min" },
    { id: 3, action: "Teleconsulta realizada", patient: "Roberto Silva", time: "há 30 min" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Visão geral do sistema VidaPlus</p>
        </div>
        <Button className="bg-gradient-primary">
          <Bell className="w-4 h-4 mr-2" />
          Notificações
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Pacientes"
          value="1,284"
          icon={Users}
          trend="+12% este mês"
          trendUp={true}
          variant="primary"
        />
        <StatCard
          title="Consultas Hoje"
          value="48"
          icon={Calendar}
          trend="8 pendentes"
          variant="secondary"
        />
        <StatCard
          title="Teleconsultas"
          value="23"
          icon={Video}
          trend="+18% esta semana"
          trendUp={true}
        />
        <StatCard
          title="Taxa de Ocupação"
          value="87%"
          icon={Activity}
          trend="+5% comparado ontem"
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
              <Button variant="outline" size="sm">Ver todos</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{appointment.patient}</p>
                    <p className="text-sm text-muted-foreground">{appointment.doctor}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{appointment.time}</p>
                    <p className="text-sm text-muted-foreground">{appointment.type}</p>
                  </div>
                </div>
              ))}
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
              <Button variant="outline" size="sm">Ver todas</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-secondary mt-2" />
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.patient}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              ))}
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
            <Button variant="outline" className="h-auto flex-col gap-2 py-4 hover:bg-primary-light hover:text-primary hover:border-primary">
              <Calendar className="w-6 h-6" />
              <span>Novo Agendamento</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4 hover:bg-primary-light hover:text-primary hover:border-primary">
              <Users className="w-6 h-6" />
              <span>Cadastrar Paciente</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4 hover:bg-primary-light hover:text-primary hover:border-primary">
              <Video className="w-6 h-6" />
              <span>Iniciar Teleconsulta</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4 hover:bg-primary-light hover:text-primary hover:border-primary">
              <FileText className="w-6 h-6" />
              <span>Gerar Relatório</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
