import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User, Plus, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAgendamentos } from "@/hooks/useAgendamentos";
import { usePacientes } from "@/hooks/usePacientes";
import { useProfissionais } from "@/hooks/useProfissionais";

export default function Agendamentos() {
  const { toast } = useToast();
  const { agendamentos, isLoading, addAgendamento, updateAgendamento, deleteAgendamento } = useAgendamentos();
  const { pacientes } = usePacientes();
  const { profissionais } = useProfissionais();
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    paciente_id: "",
    profissional_id: "",
    data_hora: "",
    tipo: "Consulta",
    observacoes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAgendamento({
      paciente_id: formData.paciente_id,
      profissional_id: formData.profissional_id,
      data_hora: formData.data_hora,
      tipo: formData.tipo,
      status: "Confirmado",
      observacoes: formData.observacoes
    });
    setOpenDialog(false);
    setFormData({
      paciente_id: "",
      profissional_id: "",
      data_hora: "",
      tipo: "Consulta",
      observacoes: ""
    });
  };

  const handleCancelAppointment = (id: string) => {
    deleteAgendamento(id);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  const todayCount = agendamentos.filter(a => 
    new Date(a.data_hora).toDateString() === new Date().toDateString()
  ).length;
  
  const thisWeekCount = agendamentos.filter(a => {
    const date = new Date(a.data_hora);
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    return date >= weekStart;
  }).length;

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
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Novo Agendamento</DialogTitle>
              <DialogDescription>
                Preencha os dados para criar um novo agendamento
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
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Consulta">Consulta</SelectItem>
                    <SelectItem value="Retorno">Retorno</SelectItem>
                    <SelectItem value="Exame">Exame</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Input
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Observações adicionais"
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

      {/* Calendar View Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hoje</p>
                <p className="text-2xl font-bold text-foreground mt-1">{todayCount} Consultas</p>
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
                <p className="text-2xl font-bold text-foreground mt-1">{thisWeekCount} Consultas</p>
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
            {agendamentos.map((agendamento) => {
              const paciente = pacientes.find(p => p.id === agendamento.paciente_id);
              const profissional = profissionais.find(p => p.id === agendamento.profissional_id);
              const dataHora = new Date(agendamento.data_hora);
              
              return (
                <div
                  key={agendamento.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex flex-col items-center bg-primary-light p-3 rounded-lg min-w-[80px]">
                      <Clock className="w-5 h-5 text-primary mb-1" />
                      <span className="font-bold text-primary">
                        {dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-foreground flex items-center gap-2">
                            {paciente?.nome || 'Paciente não encontrado'}
                          </h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <User className="w-3 h-3" />
                            {profissional?.nome || 'Profissional não encontrado'} - {profissional?.especialidade}
                          </p>
                        </div>
                        <Badge className={getStatusColor(agendamento.status)}>
                          {agendamento.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{agendamento.tipo}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 sm:flex-col lg:flex-row">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => toast({
                        title: "Atendimento iniciado",
                        description: `Chamando ${paciente?.nome}`,
                      })}
                    >
                      Atender
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleCancelAppointment(agendamento.id)}
                      disabled={agendamento.status === "Cancelado"}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
