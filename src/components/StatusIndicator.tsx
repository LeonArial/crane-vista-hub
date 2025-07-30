import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'warning' | 'maintenance';
  className?: string;
  showText?: boolean;
}

const statusConfig = {
  online: {
    label: '在线',
    bgColor: 'bg-status-online',
    textColor: 'text-status-online',
    glowClass: 'shadow-[0_0_8px_hsl(var(--status-online)_/_0.6)]'
  },
  offline: {
    label: '离线',
    bgColor: 'bg-status-offline',
    textColor: 'text-status-offline',
    glowClass: 'shadow-[0_0_8px_hsl(var(--status-offline)_/_0.6)]'
  },
  warning: {
    label: '警告',
    bgColor: 'bg-status-warning',
    textColor: 'text-status-warning',
    glowClass: 'shadow-[0_0_8px_hsl(var(--status-warning)_/_0.6)]'
  },
  maintenance: {
    label: '维护',
    bgColor: 'bg-status-maintenance',
    textColor: 'text-status-maintenance',
    glowClass: 'shadow-[0_0_8px_hsl(var(--status-maintenance)_/_0.6)]'
  }
};

export function StatusIndicator({ status, className, showText = false }: StatusIndicatorProps) {
  const config = statusConfig[status];
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div 
        className={cn(
          "w-3 h-3 rounded-full animate-pulse",
          config.bgColor,
          config.glowClass
        )}
      />
      {showText && (
        <span className={cn("text-sm font-medium", config.textColor)}>
          {config.label}
        </span>
      )}
    </div>
  );
}