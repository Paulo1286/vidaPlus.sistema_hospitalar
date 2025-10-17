import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  variant?: "default" | "primary" | "secondary";
}

export function StatCard({ title, value, icon: Icon, trend, trendUp, variant = "default" }: StatCardProps) {
  const bgClass = variant === "primary" 
    ? "bg-gradient-primary" 
    : variant === "secondary" 
    ? "bg-gradient-secondary" 
    : "bg-card";
  
  const textClass = variant === "default" ? "text-card-foreground" : "text-white";
  const iconBgClass = variant === "default" 
    ? "bg-primary-light text-primary" 
    : "bg-white/20 text-white";

  return (
    <Card className={`shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 ${bgClass}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className={`text-sm font-medium ${variant === "default" ? "text-muted-foreground" : "text-white/80"}`}>
              {title}
            </p>
            <p className={`text-3xl font-bold ${textClass}`}>
              {value}
            </p>
            {trend && (
              <p className={`text-sm ${trendUp ? "text-secondary" : "text-destructive"}`}>
                {trend}
              </p>
            )}
          </div>
          <div className={`w-12 h-12 rounded-lg ${iconBgClass} flex items-center justify-center`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
