import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Download, Calendar, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Relatorios() {
  const { toast } = useToast();

  const reports = [
    {
      id: 1,
      title: "Atendimentos Mensais",
      description: "Relatório de consultas e procedimentos do mês",
      icon: Calendar,
      period: "Janeiro 2025",
      total: "1,284 atendimentos"
    },
    {
      id: 2,
      title: "Desempenho por Especialidade",
      description: "Análise de produtividade por área médica",
      icon: TrendingUp,
      period: "Última semana",
      total: "12 especialidades"
    },
    {
      id: 3,
      title: "Taxa de Ocupação",
      description: "Uso de leitos e salas de atendimento",
      icon: Activity,
      period: "Hoje",
      total: "87% ocupação"
    },
  ];

  const quickStats = [
    { label: "Pacientes Atendidos", value: "1,284", change: "+12%", trend: "up" },
    { label: "Taxa de Ocupação", value: "87%", change: "+5%", trend: "up" },
    { label: "Receita Mensal", value: "R$ 245K", change: "+8%", trend: "up" },
    { label: "Satisfação", value: "4.8/5", change: "+0.2", trend: "up" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios e Análises</h1>
          <p className="text-muted-foreground mt-1">Indicadores e métricas do sistema</p>
        </div>
        <Button 
          className="bg-gradient-primary"
          onClick={() => toast({
            title: "Exportando dados",
            description: "Preparando arquivo para download...",
          })}
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar Dados
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="shadow-card">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-secondary flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {stat.change} vs mês anterior
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Placeholder */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Visão Geral de Atendimentos
          </CardTitle>
          <CardDescription>Comparativo mensal dos últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
            <div className="text-center space-y-2">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">Gráfico de atendimentos</p>
              <p className="text-xs text-muted-foreground">Dados dos últimos 6 meses</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <Card key={report.id} className="shadow-card hover:shadow-elegant transition-all">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center">
                  <report.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                  <CardDescription className="mt-1">{report.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Período:</span>
                  <span className="font-medium">{report.period}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-medium">{report.total}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="flex-1 bg-primary"
                    onClick={() => toast({
                      title: "Exportando relatório",
                      description: `Baixando ${report.title}...`,
                    })}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toast({
                      title: "Visualizando relatório",
                      description: `Abrindo ${report.title}`,
                    })}
                  >
                    Ver
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
