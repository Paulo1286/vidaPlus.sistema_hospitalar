import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Mail, Phone, MapPin, Calendar } from "lucide-react";

export default function Pacientes() {
  const [searchTerm, setSearchTerm] = useState("");

  const patients = [
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
  ];

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
        <Button className="bg-gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          Novo Paciente
        </Button>
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
                <Button variant="outline" size="sm">Ver Prontuário</Button>
                <Button variant="outline" size="sm">Agendar Consulta</Button>
                <Button variant="outline" size="sm">Editar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
