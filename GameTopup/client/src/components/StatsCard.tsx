import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: 'primary' | 'accent' | 'warning' | 'secondary';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, icon, color }) => {
  const colorClasses = {
    primary: 'bg-gaming-primary',
    accent: 'bg-gaming-accent',
    warning: 'bg-gaming-warning',
    secondary: 'bg-gaming-secondary'
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-gray-400 text-sm">{subtitle}</p>
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
