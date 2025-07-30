import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusIndicator } from "./StatusIndicator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets, Wind, Gauge, Clock, MapPin } from "lucide-react";

interface EquipmentDetailsData {
  id: string;
  name: string;
  code: string;
  status: 'online' | 'offline' | 'warning' | 'maintenance';
  location: string;
  type: string;
  // 塔吊特有数据
  cabinTempInside?: number;
  cabinTempOutside?: number;
  humidity?: number;
  windSpeed?: number;
  workingHours: number;
  equipmentCondition: '完好' | '损坏未保修' | '损坏已保修' | '报废';
  lastMaintenance?: string;
  nextMaintenance?: string;
  // 混凝土搅拌机特有数据
  mixingTemp?: number;
  mixingSpeed?: number;
  productionRate?: number;
}

interface EquipmentDetailsProps {
  equipment: EquipmentDetailsData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EquipmentDetails({ equipment, isOpen, onClose }: EquipmentDetailsProps) {
  if (!equipment) return null;

  const renderCraneData = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-data-primary" />
            驾驶室温度
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">室内温度</span>
              <span className="font-mono text-lg text-data-primary">
                {equipment.cabinTempInside ?? '-'}°C
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">室外温度</span>
              <span className="font-mono text-lg text-data-secondary">
                {equipment.cabinTempOutside ?? '-'}°C
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Droplets className="w-4 h-4 text-data-accent" />
            湿度
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-mono text-data-accent">
            {equipment.humidity}%
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Wind className="w-4 h-4 text-status-warning" />
            风速
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-mono text-status-warning">
            {equipment.windSpeed} m/s
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Gauge className="w-4 h-4 text-status-online" />
            设备状态
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-mono font-semibold text-status-online">
            {equipment.equipmentCondition}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMixerData = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-data-primary" />
            搅拌温度
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-mono text-data-primary">
            {equipment.mixingTemp}°C
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Gauge className="w-4 h-4 text-data-secondary" />
            搅拌速度
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-mono text-data-secondary">
            {equipment.mixingSpeed} rpm
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Gauge className="w-4 h-4 text-data-accent" />
            生产效率
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-mono text-data-accent">
            {equipment.productionRate}%
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-status-online" />
            运行时长
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-mono text-status-online">
            {equipment.workingHours}h
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{equipment.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{equipment.code}</Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {equipment.location}
                </span>
              </div>
            </div>
            <StatusIndicator status={equipment.status} showText />
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* 实时数据 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">实时监控数据</h3>
            {equipment.type === 'crane' ? renderCraneData() : renderMixerData()}
          </div>

          {/* 维护信息 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">维护信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">上次维护</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    {equipment.lastMaintenance}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">下次维护</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-status-warning font-medium">
                    {equipment.nextMaintenance}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}