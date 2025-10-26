import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FileText, Calendar, User, AlertCircle, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProntuarios } from "@/hooks/useProntuarios";
import { usePacientes } from "@/hooks/usePacientes";

export default function Prontuarios() {
  const { toast } = useToast();
  const { prontuarios, isLoading, addProntuario } = useProntuarios();
  const { pacientes } = usePacientes();
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    paciente_id: "",
    tipo: "",
    descricao: "",
    prioridade: "Baixa",
    data: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProntuario({
      paciente_id: formData.paciente_id,
      tipo: formData.tipo,
      descricao: formData.descricao,
      prioridade: formData.prioridade,
      data: new Date(formData.data).toISOString()
    });
    setOpenDialog(false);
    setFormData({
      paciente_id: "",
      tipo: "",
      descricao: "",
      prioridade: "Baixa",
      data: new Date().toISOString().split('T')[0]
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  const filteredRecords = prontuarios.filter(prontuario => {
    const paciente = pacientes.find(p => p.id === prontuario.paciente_id);
    return (
      paciente?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prontuario.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prontuario.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const todayUpdates = prontuarios.filter(p => 
    new Date(p.data).toDateString() === new Date().toDateString()
  ).length;

  const highPriority = prontuarios.filter(p => p.prioridade === "Alta").length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "bg-destructive text-destructive-foreground";
      case "Normal":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Prontuários Eletrônicos</h1>
          <p className="text-muted-foreground mt-1">Histórico clínico e registros médicos</p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Novo Prontuário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Novo Prontuário</DialogTitle>
              <DialogDescription>
                Criar registro médico para paciente
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
                <Label htmlFor="tipo">Tipo</Label>
                <Input
                  id="tipo"
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  placeholder="Ex: Consulta inicial, Exame, etc."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descreva os sintomas, diagnóstico e tratamento..."
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prioridade">Prioridade</Label>
                <Select value={formData.prioridade} onValueChange={(value) => setFormData({ ...formData, prioridade: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baixa">Baixa</SelectItem>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setOpenDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-primary">
                  Criar Prontuário
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar por paciente ou diagnóstico..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total de Prontuários</p>
              <p className="text-2xl font-bold text-foreground">{prontuarios.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Atualizados Hoje</p>
              <p className="text-2xl font-bold text-primary">{todayUpdates}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Alta Prioridade</p>
              <p className="text-2xl font-bold text-destructive">{highPriority}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Pendentes</p>
              <p className="text-2xl font-bold text-accent">8</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Records List */}
      <div className="space-y-4">
        {filteredRecords.map((prontuario) => {
          const paciente = pacientes.find(p => p.id === prontuario.paciente_id);
          
          return (
            <Card key={prontuario.id} className="shadow-card hover:shadow-elegant transition-all">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{paciente?.nome || 'Paciente não encontrado'}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {prontuario.tipo}
                      </p>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(prontuario.prioridade)}>
                    {prontuario.prioridade === "Alta" && <AlertCircle className="w-3 h-3 mr-1" />}
                    {prontuario.prioridade}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Descrição</p>
                    <p className="text-sm font-medium">{prontuario.descricao}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Data
                    </p>
                    <p className="text-sm font-medium">
                      {new Date(prontuario.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="bg-primary"
                    onClick={() => toast({
                      title: "Visualizando prontuário",
                      description: `Abrindo prontuário completo de ${paciente?.nome}`,
                    })}
                  >
                    Ver Completo
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
