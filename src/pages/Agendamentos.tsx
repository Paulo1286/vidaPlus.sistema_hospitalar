import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Plus, Video } from "lucide-react";

export default function Agendamentos() {
  const appointments = [
    {
      id: 1,
      time: "08:00",
      patient: "Maria Silva Santos",
      doctor: "Dr. João Santos",
      type: "Consulta",
      specialty: "Cardiologia",
      status: "Confirmado",
      isTelemedicine: false
    },
    {
      id: 2,
      time: "09:30",
      patient: "Pedro Oliveira",
      doctor: "Dra. Ana Costa",
      type: "Retorno",
      specialty: "Pediatria",
      status: "Confirmado",
      isTelemedicine: true
    },
    {
      id: 3,
      time: "10:00",
      patient: "Carla Santos",
      doctor: "Dr. Paulo Lima",
      type: "Exame",
      specialty: "Ortopedia",
      status: "Aguardando",
      isTelemedicine: false
    },
    {
      id: 4,
      time: "11:00",
      patient: "Roberto Silva",
      doctor: "Dra. Fernanda Alves",
      type: "Consulta",
      specialty: "Dermatologia",
      status: "Confirmado",
      isTelemedicine: true
    },
    {
      id: 5,
      time: "14:00",
      patient: "Juliana Costa",
      doctor: "Dr. Carlos Mendes",
      type: "Retorno",
      specialty: "Neurologia",
      status: "Confirmado",
      isTelemedicine: false
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmado":
        return "bg-secondary text-secondary-foreground";
      case "Aguardando":
        return "bg-accent text-accent-foreground";
      case "Cancelado":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agendamentos</h1>
          <p className="text-muted-foreground mt-1">Gestão de consultas e procedimentos</p>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      {/* Calendar View Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hoje</p>
                <p className="text-2xl font-bold text-foreground mt-1">15 Consultas</p>
              </div>
              <Calendar className="w-10 h-10 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Esta Semana</p>
                <p className="text-2xl font-bold text-foreground mt-1">89 Consultas</p>
              </div>
              <Clock className="w-10 h-10 text-secondary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Teleconsultas</p>
                <p className="text-2xl font-bold text-foreground mt-1">23 Hoje</p>
              </div>
              <Video className="w-10 h-10 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments List */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Agenda de Hoje - 17 de Outubro, 2025</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex flex-col items-center bg-primary-light p-3 rounded-lg min-w-[80px]">
                    <Clock className="w-5 h-5 text-primary mb-1" />
                    <span className="font-bold text-primary">{appointment.time}</span>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                          {appointment.patient}
                          {appointment.isTelemedicine && (
                            <Video className="w-4 h-4 text-accent" />
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <User className="w-3 h-3" />
                          {appointment.doctor} - {appointment.specialty}
                        </p>
                      </div>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{appointment.type}</Badge>
                      {appointment.isTelemedicine && (
                        <Badge variant="outline" className="border-accent text-accent">
                          Online
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 sm:flex-col lg:flex-row">
                  {appointment.isTelemedicine ? (
                    <Button size="sm" className="bg-accent hover:bg-accent/90">
                      <Video className="w-4 h-4 mr-2" />
                      Iniciar
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline">Atender</Button>
                  )}
                  <Button size="sm" variant="outline">Detalhes</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
