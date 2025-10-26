import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Video, Calendar, Clock, User, PhoneCall, Monitor, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTelemedicina } from "@/hooks/useTelemedicina";
import { usePacientes } from "@/hooks/usePacientes";
import { useProfissionais } from "@/hooks/useProfissionais";

export default function Telemedicina() {
  const { toast } = useToast();
  const { consultas, isLoading, addConsulta, updateConsulta } = useTelemedicina();
  const { pacientes } = usePacientes();
  const { profissionais } = useProfissionais();
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    paciente_id: "",
    profissional_id: "",
    data_hora: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addConsulta({
      paciente_id: formData.paciente_id,
      profissional_id: formData.profissional_id,
      data_hora: formData.data_hora,
      status: "Agendada"
    });
    setOpenDialog(false);
    setFormData({
      paciente_id: "",
      profissional_id: "",
      data_hora: ""
    });
  };

  const handleStartConsultation = (id: string) => {
    updateConsulta({
      id,
      status: "Em andamento"
    });
    toast({
      title: "Teleconsulta iniciada",
      description: "Consulta está em andamento",
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  const activeConsultations = consultas.filter(t => t.status === "Em andamento");
  const scheduledConsultations = consultas.filter(t => t.status === "Agendada");
  const todayConsultations = consultas.filter(t =>
    new Date(t.data_hora).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Telemedicina</h1>
          <p className="text-muted-foreground mt-1">Consultas virtuais e atendimento remoto</p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Video className="w-4 h-4 mr-2" />
              Nova Teleconsulta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Agendar Teleconsulta</DialogTitle>
              <DialogDescription>
                Preencha os dados para agendar uma nova teleconsulta
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paciente">Paciente</Label>
                <Select value={formData.paciente_id} onValueChange={(value) => setFormData({ ...formData, paciente_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {pacientes.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="profissional">Profissional</Label>
                <Select value={formData.profissional_id} onValueChange={(value) => setFormData({ ...formData, profissional_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um profissional" />
                  </SelectTrigger>
                  <SelectContent>
                    {profissionais.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.nome} - {p.especialidade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_hora">Data e Horário</Label>
                <Input
                  id="data_hora"
                  type="datetime-local"
                  value={formData.data_hora}
                  onChange={(e) => setFormData({ ...formData, data_hora: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setOpenDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-primary">
                  Agendar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-card bg-gradient-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Consultas Hoje</p>
                <p className="text-3xl font-bold text-white mt-1">{todayConsultations}</p>
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
                <p className="text-3xl font-bold text-foreground mt-1">{activeConsultations.length}</p>
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
                <p className="text-3xl font-bold text-foreground mt-1">{scheduledConsultations.length}</p>
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
            {activeConsultations.map((telemedicina) => {
              const paciente = pacientes.find(p => p.id === telemedicina.paciente_id);
              const profissional = profissionais.find(p => p.id === telemedicina.profissional_id);
              const dataHora = new Date(telemedicina.data_hora);
              
              return (
                <div
                  key={telemedicina.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-border rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{paciente?.nome}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <User className="w-3 h-3" />
                        {profissional?.nome}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <p className="text-sm flex items-center gap-1">
                          <Clock className="w-3 h-3 text-primary" />
                          {dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {telemedicina.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      className="bg-accent hover:bg-accent/90"
                      onClick={() => toast({
                        title: "Entrando na sala",
                        description: `Conectando à consulta de ${paciente?.nome}...`,
                      })}
                    >
                      <PhoneCall className="w-4 h-4 mr-2" />
                      Entrar na Sala
                    </Button>
                  </div>
                </div>
              );
            })}
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
            {scheduledConsultations.map((telemedicina) => {
              const paciente = pacientes.find(p => p.id === telemedicina.paciente_id);
              const profissional = profissionais.find(p => p.id === telemedicina.profissional_id);
              const dataHora = new Date(telemedicina.data_hora);
              
              return (
                <div
                  key={telemedicina.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center bg-primary-light p-3 rounded-lg min-w-[80px]">
                      <Clock className="w-5 h-5 text-primary mb-1" />
                      <span className="font-bold text-primary">
                        {dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{paciente?.nome}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {profissional?.nome} - {profissional?.especialidade}
                      </p>
                    </div>
                  </div>
                  <Button 
                    className="bg-secondary hover:bg-secondary/90"
                    onClick={() => handleStartConsultation(telemedicina.id)}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Iniciar
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
