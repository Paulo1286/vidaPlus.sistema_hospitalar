import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Download, Calendar, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePacientes } from "@/hooks/usePacientes";
import { useAgendamentos } from "@/hooks/useAgendamentos";
import { useProfissionais } from "@/hooks/useProfissionais";
import { useProntuarios } from "@/hooks/useProntuarios";
import { useTelemedicina } from "@/hooks/useTelemedicina";

export default function Relatorios() {
  const { toast } = useToast();
  const { pacientes } = usePacientes();
  const { agendamentos } = useAgendamentos();
  const { profissionais } = useProfissionais();
  const { prontuarios } = useProntuarios();
  const { consultas } = useTelemedicina();

  // Calcular estatísticas
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const atendimentosMes = agendamentos.filter(a => {
    const date = new Date(a.data_hora);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;

  const teleconsultasMes = consultas.filter(t => {
    const date = new Date(t.data_hora);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;

  const totalAtendimentos = atendimentosMes + teleconsultasMes;

  // Agrupar por especialidade
  const atendimentosPorEspecialidade = profissionais.reduce((acc, prof) => {
    const count = agendamentos.filter(a => a.profissional_id === prof.id).length;
    if (count > 0) {
      acc[prof.especialidade] = (acc[prof.especialidade] || 0) + count;
    }
    return acc;
  }, {} as Record<string, number>);

  const especialidades = Object.keys(atendimentosPorEspecialidade).length;

  // Taxa de ocupação (simulada)
  const taxaOcupacao = Math.round((totalAtendimentos / (profissionais.length * 30)) * 100);
  
  // Satisfação (simulada)
  const satisfacao = 4.8;

  const reports = [
    {
      id: 1,
      title: "Atendimentos Mensais",
      description: "Relatório de consultas e procedimentos do mês",
      icon: Calendar,
      period: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
      total: `${totalAtendimentos} atendimentos`
    },
    {
      id: 2,
      title: "Desempenho por Especialidade",
      description: "Análise de produtividade por área médica",
      icon: TrendingUp,
      period: "Este mês",
      total: `${especialidades} especialidades ativas`
    },
    {
      id: 3,
      title: "Taxa de Ocupação",
      description: "Uso de recursos e profissionais",
      icon: Activity,
      period: "Este mês",
      total: `${taxaOcupacao}% ocupação`
    },
  ];

  const quickStats = [
    { label: "Pacientes Cadastrados", value: pacientes.length.toString(), change: "Total no sistema", trend: "up" },
    { label: "Taxa de Ocupação", value: `${taxaOcupacao}%`, change: "Este mês", trend: "up" },
    { label: "Atendimentos Totais", value: totalAtendimentos.toString(), change: "Este mês", trend: "up" },
    { label: "Satisfação", value: `${satisfacao}/5`, change: "Média geral", trend: "up" },
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
