import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Pacientes() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPatient, setEditingPatient] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    email: "",
    phone: "",
    address: ""
  });

  const [patients, setPatients] = useState([
    { 
      id: 1, 
      name: "Maria Silva Santos", 
      cpf: "123.456.789-00", 
      email: "maria.silva@email.com",
      phone: "(11) 98765-4321",
      birthDate: "15/03/1985",
      address: "São Paulo, SP",
      status: "Ativo",
      lastVisit: "10/01/2025"
    },
    { 
      id: 2, 
      name: "João Pedro Oliveira", 
      cpf: "987.654.321-00", 
      email: "joao.pedro@email.com",
      phone: "(11) 91234-5678",
      birthDate: "22/07/1992",
      address: "Campinas, SP",
      status: "Ativo",
      lastVisit: "08/01/2025"
    },
    { 
      id: 3, 
      name: "Ana Paula Costa", 
      cpf: "456.789.123-00", 
      email: "ana.costa@email.com",
      phone: "(11) 99876-5432",
      birthDate: "30/11/1978",
      address: "Santos, SP",
      status: "Ativo",
      lastVisit: "05/01/2025"
    },
  ]);

  const handleOpenDialog = (patient?: any) => {
    if (patient) {
      setEditingPatient(patient);
      setFormData({
        name: patient.name,
        cpf: patient.cpf,
        email: patient.email,
        phone: patient.phone,
        address: patient.address
      });
    } else {
      setEditingPatient(null);
      setFormData({
        name: "",
        cpf: "",
        email: "",
        phone: "",
        address: ""
      });
    }
    setOpenDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPatient) {
      setPatients(patients.map(p => 
        p.id === editingPatient.id 
          ? { ...p, ...formData }
          : p
      ));
      toast({
        title: "Paciente atualizado",
        description: "Os dados do paciente foram atualizados com sucesso.",
      });
    } else {
      const newPatient = {
        id: patients.length + 1,
        ...formData,
        birthDate: "01/01/1990",
        lastVisit: new Date().toLocaleDateString('pt-BR'),
        status: "Ativo"
      };
      setPatients([...patients, newPatient]);
      toast({
        title: "Paciente cadastrado",
        description: "Novo paciente adicionado com sucesso.",
      });
    }
    
    setOpenDialog(false);
    setFormData({
      name: "",
      cpf: "",
      email: "",
      phone: "",
      address: ""
    });
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.cpf.includes(searchTerm) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Pacientes</h1>
          <p className="text-muted-foreground mt-1">Cadastro e gerenciamento de pacientes</p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary" onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingPatient ? "Editar Paciente" : "Novo Paciente"}</DialogTitle>
              <DialogDescription>
                {editingPatient ? "Atualize os dados do paciente" : "Preencha os dados para cadastrar um novo paciente"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Maria Silva Santos"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  placeholder="123.456.789-00"
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
                  placeholder="paciente@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(11) 98765-4321"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Localização</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="São Paulo, SP"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setOpenDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-primary">
                  {editingPatient ? "Atualizar" : "Cadastrar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Stats */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por nome, CPF ou email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <div className="bg-primary-light px-4 py-2 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">{patients.length}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
              <div className="bg-secondary-light px-4 py-2 rounded-lg text-center">
                <p className="text-2xl font-bold text-secondary">{patients.length}</p>
                <p className="text-xs text-muted-foreground">Ativos</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patients List */}
      <div className="grid gap-4">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="shadow-card hover:shadow-elegant transition-all">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{patient.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">CPF: {patient.cpf}</p>
                </div>
                <Badge variant="default" className="bg-secondary">
                  {patient.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-primary mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{patient.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-primary mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Telefone</p>
                    <p className="text-sm font-medium">{patient.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Localização</p>
                    <p className="text-sm font-medium">{patient.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-primary mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Última Visita</p>
                    <p className="text-sm font-medium">{patient.lastVisit}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast({
                    title: "Prontuário",
                    description: `Abrindo prontuário de ${patient.name}`,
                  })}
                >
                  Ver Prontuário
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast({
                    title: "Agendamento",
                    description: `Iniciando agendamento para ${patient.name}`,
                  })}
                >
                  Agendar Consulta
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleOpenDialog(patient)}
                >
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
