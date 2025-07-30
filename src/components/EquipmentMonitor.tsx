import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { Button } from "@/components/ui/button";
import { EquipmentCard } from "./EquipmentCard";
import { EquipmentDetails } from "./EquipmentDetails";
import { Construction, Truck, RefreshCw, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

// Updated types to match backend API response
type EquipmentType = 'crane' | 'mixer';

export interface Equipment {
  id: number;
  name: string;
  code: string;
  status: 'online' | 'offline' | 'warning' | 'maintenance';
  location: string;
  type: EquipmentType;
  workingHours: number;
  equipmentCondition: string;
  lastUpdate: string; // ISO-8601 date string
  cabinTempInside?: number;
  cabinTempOutside?: number;
  humidity?: number;
  windSpeed?: number;
  lastMaintenance?: string; // Date string
  nextMaintenance?: string; // Date string
  mixingTemp?: number;
  mixingSpeed?: number;
  productionRate?: number;
}

// Function to fetch equipment data from the backend
const fetchEquipment = async (): Promise<Equipment[]> => {
  const response = await fetch('http://localhost:8080/api/equipment');
  if (!response.ok) {
    throw new Error('网络响应错误');
  }
  return response.json();
};

export function EquipmentMonitor() {
  const [selectedType, setSelectedType] = useState<EquipmentType>('crane');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: allEquipment = [], isLoading, isError, refetch } = useQuery<Equipment[]>({
    queryKey: ['equipment'],
    queryFn: fetchEquipment,
    staleTime: Infinity, // 数据通过 WebSocket 实时更新，因此将 HTTP 拉取的数据标记为永不过期
  });

  useEffect(() => {
    // 创建一个 Stomp 客户端实例
    const stompClient = new Client({
      // 使用 SockJS 作为 WebSocket 的备用方案，增强浏览器兼容性
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      // 设置连接成功时的回调
      onConnect: () => {
        console.log('WebSocket Connected!');
        // 订阅后端的 /topic/equipment-updates 主题
        stompClient.subscribe('/topic/equipment-updates', (message) => {
          const updatedEquipment = JSON.parse(message.body);
          // 使用从 WebSocket 收到的新数据更新 React Query 的缓存
          queryClient.setQueryData(['equipment'], updatedEquipment);
        });
      },
      // 连接失败或断开时的日志
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
      // 设置自动重连延迟（毫秒）
      reconnectDelay: 5000,
    });

    // 激活客户端，开始连接
    stompClient.activate();

    // 组件卸载时，停用客户端，断开连接
    return () => {
      stompClient.deactivate();
      console.log('WebSocket Disconnected!');
    };
  }, [queryClient]); // 依赖项中包含 queryClient

  const filteredEquipment = allEquipment.filter(eq => eq.type === selectedType);

  const getTypeStats = (type: EquipmentType) => {
    const equipmentOfType = allEquipment.filter(eq => eq.type === type);
    const online = equipmentOfType.filter(eq => eq.status === 'online').length;
    const total = equipmentOfType.length;
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
      {/* Header */}
      <div className="border-b border-border/40 bg-gradient-to-r from-card to-secondary/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">工程设备监控平台</h1>
              <p className="text-muted-foreground mt-1">实时监控设备运行状态</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => refetch()}>
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
              刷新数据
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Equipment Type Selection */}
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
                disabled={isLoading}
              >
                <IconComponent className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">{config.label}</div>
                  <div className="text-xs opacity-80">
                    {isLoading ? '加载中...' : `${config.stats.online}/${config.stats.total} 在线`}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>

        {/* Equipment Status Overview */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {typeConfig[selectedType].label}状态概览
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center h-64 bg-destructive/10 text-destructive rounded-lg">
                <AlertTriangle className="w-12 h-12 mb-4" />
                <p className="text-lg font-semibold">数据加载失败</p>
                <p>请检查后端服务是否正在运行，并刷新页面。</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEquipment.map((equipment) => (
                <EquipmentCard
                  key={equipment.id}
                  equipment={equipment}
                  onClick={() => handleEquipmentClick(equipment)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Equipment Details Modal */}
      <EquipmentDetails
        equipment={selectedEquipment}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
}