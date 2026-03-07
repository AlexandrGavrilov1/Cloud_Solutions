import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  loading?: boolean;
  trend?: number;
  trendLabel?: string;
}

export const MetricCard = ({ label, value, icon, loading, trend, trendLabel }: MetricCardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            {loading ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <div className="text-3xl font-bold mt-1">{value}</div>
            )}
            {trend !== undefined && (
              <div className="flex items-center gap-1 mt-2 text-sm">
                {trend > 0 ? (
                  <Icon name="ArrowUp" size={14} className="text-green-500" />
                ) : trend < 0 ? (
                  <Icon name="ArrowDown" size={14} className="text-red-500" />
                ) : null}
                <span className={trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-muted-foreground'}>
                  {Math.abs(trend)}%
                </span>
                {trendLabel && <span className="text-muted-foreground ml-1">{trendLabel}</span>}
              </div>
            )}
          </div>
          {icon && <div className="text-primary">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
};
