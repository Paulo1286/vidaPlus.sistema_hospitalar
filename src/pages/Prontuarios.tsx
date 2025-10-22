import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, FileText, Calendar, User, AlertCircle, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Prontuarios() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [entryData, setEntryData] = useState({
    notes: "",
    diagnosis: "",
    prescription: ""
  });

  const [medicalRecords, setMedicalRecords] = useState([
    {
      id: 1,
      patient: "Maria Silva Santos",
      lastUpdate: "10/01/2025",
      doctor: "Dr. João Santos",
      diagnosis: "Hipertensão Arterial",
      status: "Em tratamento",
      priority: "Normal"
    },
    {
      id: 2,
      patient: "Pedro Oliveira",
      lastUpdate: "08/01/2025",
      doctor: "Dra. Ana Costa",
      diagnosis: "Diabetes Tipo 2",
      status: "Controlado",
      priority: "Normal"
    },
    {
      id: 3,
      patient: "Carla Santos",
      lastUpdate: "05/01/2025",
      doctor: "Dr. Paulo Lima",
      diagnosis: "Fratura de Fêmur",
      status: "Em recuperação",
      priority: "Alta"
    },
  ]);

  const handleOpenDialog = (record: any) => {
    setSelectedRecord(record);
    setOpenDialog(true);
  };

  const handleSubmitEntry = (e: React.FormEvent) => {
    e.preventDefault();
    setMedicalRecords(medicalRecords.map(record =>
      record.id === selectedRecord.id
        ? { ...record, lastUpdate: new Date().toLocaleDateString('pt-BR') }
        : record
    ));
    toast({
      title: "Entrada adicionada",
      description: `Prontuário de ${selectedRecord.patient} atualizado com sucesso.`,
    });
    setOpenDialog(false);
    setEntryData({
      notes: "",
      diagnosis: "",
      prescription: ""
    });
  };

  const filteredRecords = medicalRecords.filter(record =>
    record.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <p className="text-2xl font-bold text-foreground">1,284</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Atualizados Hoje</p>
              <p className="text-2xl font-bold text-primary">48</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Alta Prioridade</p>
              <p className="text-2xl font-bold text-destructive">12</p>
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
        {filteredRecords.map((record) => (
          <Card key={record.id} className="shadow-card hover:shadow-elegant transition-all">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{record.patient}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {record.doctor}
                    </p>
                  </div>
                </div>
                <Badge className={getPriorityColor(record.priority)}>
                  {record.priority === "Alta" && <AlertCircle className="w-3 h-3 mr-1" />}
                  {record.priority}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Diagnóstico</p>
                  <p className="text-sm font-medium">{record.diagnosis}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="text-sm font-medium">{record.status}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Última Atualização
                  </p>
                  <p className="text-sm font-medium">{record.lastUpdate}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-4 border-t border-border">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="bg-primary"
                  onClick={() => toast({
                    title: "Visualizando prontuário",
                    description: `Abrindo prontuário completo de ${record.patient}`,
                  })}
                >
                  Ver Completo
                </Button>
                <Dialog open={openDialog && selectedRecord?.id === record.id} onOpenChange={setOpenDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleOpenDialog(record)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Entrada
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Nova Entrada no Prontuário</DialogTitle>
                      <DialogDescription>
                        Adicionar informações ao prontuário de {selectedRecord?.patient}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitEntry} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="notes">Anotações Clínicas</Label>
                        <Textarea
                          id="notes"
                          value={entryData.notes}
                          onChange={(e) => setEntryData({ ...entryData, notes: e.target.value })}
                          placeholder="Descreva os sintomas, exame físico e observações..."
                          rows={4}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="diagnosis">Diagnóstico</Label>
                        <Input
                          id="diagnosis"
                          value={entryData.diagnosis}
                          onChange={(e) => setEntryData({ ...entryData, diagnosis: e.target.value })}
                          placeholder="Diagnóstico ou hipótese diagnóstica"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prescription">Prescrição</Label>
                        <Textarea
                          id="prescription"
                          value={entryData.prescription}
                          onChange={(e) => setEntryData({ ...entryData, prescription: e.target.value })}
                          placeholder="Medicamentos, dosagem e orientações..."
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setOpenDialog(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit" className="flex-1 bg-primary">
                          Salvar Entrada
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast({
                    title: "Exames",
                    description: `Visualizando exames de ${record.patient}`,
                  })}
                >
                  Exames
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast({
                    title: "Prescrições",
                    description: `Visualizando prescrições de ${record.patient}`,
                  })}
                >
                  Prescrições
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
