import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UserCog, Calendar, Mail, Phone, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProfissionais } from "@/hooks/useProfissionais";
import { useAgendamentos } from "@/hooks/useAgendamentos";

export default function Profissionais() {
  const { toast } = useToast();
  const { profissionais, isLoading, addProfissional } = useProfissionais();
  const { agendamentos } = useAgendamentos();
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    especialidade: "",
    crm: "",
    email: "",
    telefone: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProfissional(formData);
    setOpenDialog(false);
    setFormData({
      nome: "",
      especialidade: "",
      crm: "",
      email: "",
      telefone: ""
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  const totalProfissionais = profissionais.length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profissionais de Saúde</h1>
          <p className="text-muted-foreground mt-1">Gestão de médicos, enfermeiros e equipe</p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Novo Profissional
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Novo Profissional</DialogTitle>
              <DialogDescription>
                Cadastrar novo profissional de saúde
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Dr. João Santos"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="especialidade">Especialidade</Label>
                <Input
                  id="especialidade"
                  value={formData.especialidade}
                  onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
                  placeholder="Cardiologia"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="crm">CRM</Label>
                <Input
                  id="crm"
                  value={formData.crm}
                  onChange={(e) => setFormData({ ...formData, crm: e.target.value })}
                  placeholder="CRM/SP 123456"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="medico@vidaplus.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="(11) 98765-4321"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setOpenDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-primary">
                  Cadastrar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="shadow-card bg-gradient-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Total</p>
                <p className="text-3xl font-bold text-white mt-1">{totalProfissionais}</p>
              </div>
              <UserCog className="w-10 h-10 text-white/80" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Médicos</p>
              <p className="text-2xl font-bold text-foreground">32</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Enfermeiros</p>
              <p className="text-2xl font-bold text-foreground">12</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Técnicos</p>
              <p className="text-2xl font-bold text-foreground">4</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Professionals List */}
      <div className="grid gap-6 md:grid-cols-2">
        {profissionais.map((profissional) => {
          const profissionalAgendamentos = agendamentos.filter(a => a.profissional_id === profissional.id);
          const todayAppointments = profissionalAgendamentos.filter(a => 
            new Date(a.data_hora).toDateString() === new Date().toDateString()
          ).length;
          
          return (
            <Card key={profissional.id} className="shadow-card hover:shadow-elegant transition-all">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-lg">
                      {profissional.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{profissional.nome}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{profissional.especialidade}</p>
                      <p className="text-xs text-muted-foreground mt-1">{profissional.crm}</p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-secondary">
                    Ativo
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>{profissional.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>{profissional.telefone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{todayAppointments} consultas hoje</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="bg-primary flex-1"
                    onClick={() => toast({
                      title: "Agenda",
                      description: `Visualizando agenda de ${profissional.nome}`,
                    })}
                  >
                    Ver Agenda
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toast({
                      title: "Edição",
                      description: `Editando dados de ${profissional.nome}`,
                    })}
                  >
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
