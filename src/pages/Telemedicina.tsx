import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Calendar, Clock, User, PhoneCall, Monitor } from "lucide-react";

export default function Telemedicina() {
  const activeConsultations = [
    {
      id: 1,
      patient: "Maria Silva",
      doctor: "Dr. João Santos",
      startTime: "09:00",
      duration: "12 min",
      status: "Em andamento"
    },
    {
      id: 2,
      patient: "Pedro Oliveira",
      doctor: "Dra. Ana Costa",
      startTime: "09:30",
      duration: "5 min",
      status: "Aguardando"
    }
  ];

  const scheduledConsultations = [
    {
      id: 1,
      patient: "Carlos Santos",
      doctor: "Dr. Paulo Lima",
      scheduledTime: "10:30",
      specialty: "Cardiologia"
    },
    {
      id: 2,
      patient: "Juliana Costa",
      doctor: "Dra. Fernanda Alves",
      scheduledTime: "11:00",
      specialty: "Dermatologia"
    },
    {
      id: 3,
      patient: "Roberto Silva",
      doctor: "Dr. Carlos Mendes",
      scheduledTime: "14:00",
      specialty: "Neurologia"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Telemedicina</h1>
          <p className="text-muted-foreground mt-1">Consultas virtuais e atendimento remoto</p>
        </div>
        <Button className="bg-gradient-primary">
          <Video className="w-4 h-4 mr-2" />
          Nova Teleconsulta
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-card bg-gradient-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Consultas Hoje</p>
                <p className="text-3xl font-bold text-white mt-1">23</p>
              </div>
              <Video className="w-10 h-10 text-white/80" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Em Andamento</p>
                <p className="text-3xl font-bold text-foreground mt-1">2</p>
              </div>
              <Monitor className="w-10 h-10 text-secondary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Agendadas</p>
                <p className="text-3xl font-bold text-foreground mt-1">8</p>
              </div>
              <Calendar className="w-10 h-10 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Consultations */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-secondary" />
            Consultas Ativas
          </CardTitle>
          <CardDescription>Atendimentos em andamento ou aguardando início</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeConsultations.map((consultation) => (
              <div
                key={consultation.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-border rounded-lg bg-muted/30"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{consultation.patient}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <User className="w-3 h-3" />
                      {consultation.doctor}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <p className="text-sm flex items-center gap-1">
                        <Clock className="w-3 h-3 text-primary" />
                        Iniciou às {consultation.startTime}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {consultation.duration}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {consultation.status === "Em andamento" ? (
                    <Button className="bg-accent hover:bg-accent/90">
                      <PhoneCall className="w-4 h-4 mr-2" />
                      Entrar na Sala
                    </Button>
                  ) : (
                    <Button className="bg-secondary hover:bg-secondary/90">
                      <Video className="w-4 h-4 mr-2" />
                      Iniciar Consulta
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Consultations */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Próximas Teleconsultas
          </CardTitle>
          <CardDescription>Consultas virtuais agendadas para hoje</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scheduledConsultations.map((consultation) => (
              <div
                key={consultation.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center bg-primary-light p-3 rounded-lg min-w-[80px]">
                    <Clock className="w-5 h-5 text-primary mb-1" />
                    <span className="font-bold text-primary">{consultation.scheduledTime}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{consultation.patient}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {consultation.doctor} - {consultation.specialty}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Ver Detalhes</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
