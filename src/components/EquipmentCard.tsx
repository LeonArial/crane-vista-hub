import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIndicator } from "./StatusIndicator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EquipmentData {
  id: string;
  name: string;
  code: string;
  status: 'online' | 'offline' | 'warning' | 'maintenance';
  location: string;
  lastUpdate: string;
  workingHours: number;
  equipmentCondition: '完好' | '损坏未保修' | '损坏已保修' | '报废';
}

interface EquipmentCardProps {
  equipment: EquipmentData;
  onClick: () => void;
  className?: string;
}

export function EquipmentCard({ equipment, onClick, className }: EquipmentCardProps) {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case '完好': return 'text-status-online';
      case '损坏未保修': return 'text-status-offline';
      case '损坏已保修': return 'text-status-warning';
      case '报废': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-border/40",
        "bg-gradient-to-br from-card to-secondary/20",
        "hover:shadow-[0_8px_30px_hsl(var(--primary)_/_0.12)]",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{equipment.name}</CardTitle>
          <StatusIndicator status={equipment.status} />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {equipment.code}
          </Badge>
          <span className="text-xs text-muted-foreground">{equipment.location}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">运行时长</span>
            <div className="font-mono text-data-primary">
              {equipment.workingHours}h
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">设备状态</span>
            <div className={cn("font-mono font-semibold", getConditionColor(equipment.equipmentCondition))}>
              {equipment.equipmentCondition}
            </div>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground border-t pt-2">
          最后更新: {equipment.lastUpdate}
        </div>
      </CardContent>
    </Card>
  );
}