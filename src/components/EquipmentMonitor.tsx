import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EquipmentCard } from "./EquipmentCard";
import { EquipmentDetails } from "./EquipmentDetails";
import { Construction, Truck, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

type EquipmentType = 'crane' | 'mixer';

interface Equipment {
  id: string;
  name: string;
  code: string;
  status: 'online' | 'offline' | 'warning' | 'maintenance';
  location: string;
  type: EquipmentType;
  workingHours: number;
  equipmentCondition: '完好' | '损坏未保修' | '损坏已保修' | '报废';
  lastUpdate: string;
  // 塔吊特有数据
  cabinTemp?: {
    inside: number;
    outside: number;
  };
  humidity?: number;
  windSpeed?: number;
  lastMaintenance?: string;
  nextMaintenance?: string;
  // 混凝土搅拌机特有数据
  mixingTemp?: number;
  mixingSpeed?: number;
  productionRate?: number;
}

// 模拟数据
const mockEquipment: Equipment[] = [
  // 塔吊数据
  {
    id: '1',
    name: '塔吊-001',
    code: 'TC-001',
    status: 'online',
    location: 'A区-1号楼',
    type: 'crane',
    workingHours: 127,
    equipmentCondition: '完好',
    lastUpdate: '2024-01-30 14:23:15',
    cabinTemp: { inside: 24, outside: 18 },
    humidity: 65,
    windSpeed: 3.2,
    lastMaintenance: '2024-01-20',
    nextMaintenance: '2024-02-20'
  },
  {
    id: '2',
    name: '塔吊-002',
    code: 'TC-002',
    status: 'warning',
    location: 'A区-2号楼',
    type: 'crane',
    workingHours: 89,
    equipmentCondition: '损坏已保修',
    lastUpdate: '2024-01-30 14:22:45',
    cabinTemp: { inside: 26, outside: 18 },
    humidity: 70,
    windSpeed: 4.1,
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-02-15'
  },
  {
    id: '3',
    name: '塔吊-003',
    code: 'TC-003',
    status: 'offline',
    location: 'B区-1号楼',
    type: 'crane',
    workingHours: 234,
    equipmentCondition: '损坏未保修',
    lastUpdate: '2024-01-30 12:15:30',
    cabinTemp: { inside: 20, outside: 18 },
    humidity: 55,
    windSpeed: 2.8,
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-02-10'
  },
  // 混凝土搅拌机数据
  {
    id: '4',
    name: '搅拌机-001',
    code: 'CM-001',
    status: 'online',
    location: '搅拌站-A',
    type: 'mixer',
    workingHours: 156,
    equipmentCondition: '完好',
    lastUpdate: '2024-01-30 14:24:10',
    mixingTemp: 35,
    mixingSpeed: 45,
    productionRate: 92,
    lastMaintenance: '2024-01-25',
    nextMaintenance: '2024-02-25'
  },
  {
    id: '5',
    name: '搅拌机-002',
    code: 'CM-002',
    status: 'maintenance',
    location: '搅拌站-B',
    type: 'mixer',
    workingHours: 203,
    equipmentCondition: '报废',
    lastUpdate: '2024-01-30 10:30:00',
    mixingTemp: 28,
    mixingSpeed: 0,
    productionRate: 0,
    lastMaintenance: '2024-01-30',
    nextMaintenance: '2024-03-01'
  },
  {
    id: '6',
    name: '搅拌机-003',
    code: 'CM-003',
    status: 'online',
    location: '搅拌站-C',
    type: 'mixer',
    workingHours: 98,
    equipmentCondition: '完好',
    lastUpdate: '2024-01-30 14:23:55',
    mixingTemp: 32,
    mixingSpeed: 42,
    productionRate: 88,
    lastMaintenance: '2024-01-18',
    nextMaintenance: '2024-02-18'
  }
];

export function EquipmentMonitor() {
  const [selectedType, setSelectedType] = useState<EquipmentType>('crane');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredEquipment = mockEquipment.filter(eq => eq.type === selectedType);

  const getTypeStats = (type: EquipmentType) => {
    const equipment = mockEquipment.filter(eq => eq.type === type);
    const online = equipment.filter(eq => eq.status === 'online').length;
    const total = equipment.length;
    return { online, total };
  };

  const handleEquipmentClick = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setIsDetailsOpen(true);
  };

  const typeConfig = {
    crane: {
      label: '塔吊',
      icon: Construction,
      stats: getTypeStats('crane')
    },
    mixer: {
      label: '混凝土搅拌机',
      icon: Truck,
      stats: getTypeStats('mixer')
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 页头 */}
      <div className="border-b border-border/40 bg-gradient-to-r from-card to-secondary/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">工程设备监控平台</h1>
              <p className="text-muted-foreground mt-1">实时监控设备运行状态</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              刷新数据
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* 设备类别选择 */}
        <div className="flex gap-4 mb-8">
          {Object.entries(typeConfig).map(([type, config]) => {
            const IconComponent = config.icon;
            const isActive = selectedType === type;
            
            return (
              <Button
                key={type}
                variant={isActive ? "default" : "outline"}
                size="lg"
                onClick={() => setSelectedType(type as EquipmentType)}
                className={cn(
                  "flex items-center gap-3 px-6 py-4 h-auto",
                  isActive && "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)_/_0.3)]"
                )}
              >
                <IconComponent className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">{config.label}</div>
                  <div className="text-xs opacity-80">
                    {config.stats.online}/{config.stats.total} 在线
                  </div>
                </div>
              </Button>
            );
          })}
        </div>

        {/* 设备状态概览 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {typeConfig[selectedType].label}状态概览
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.map((equipment) => (
              <EquipmentCard
                key={equipment.id}
                equipment={equipment}
                onClick={() => handleEquipmentClick(equipment)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 设备详情弹窗 */}
      <EquipmentDetails
        equipment={selectedEquipment}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
}