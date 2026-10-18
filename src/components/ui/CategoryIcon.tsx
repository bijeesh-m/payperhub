import React from 'react';
import { 
  Zap, 
  BatteryCharging, 
  ShieldCheck, 
  Cpu, 
  Lightbulb, 
  Bike, 
  CircleDot, 
  Wrench,
  Package
} from 'lucide-react';

interface CategoryIconProps {
  slug: string;
  size?: number;
  className?: string;
}

export default function CategoryIcon({ slug, size = 18, className }: CategoryIconProps) {
  switch (slug) {
    case 'motors-controllers':
      return <Zap size={size} className={className} />;
    case 'batteries-charging':
      return <BatteryCharging size={size} className={className} />;
    case 'brakes-safety':
      return <ShieldCheck size={size} className={className} />;
    case 'displays-computers':
      return <Cpu size={size} className={className} />;
    case 'lighting-electrical':
      return <Lightbulb size={size} className={className} />;
    case 'frames-forks':
      return <Bike size={size} className={className} />;
    case 'tires-wheels':
      return <CircleDot size={size} className={className} />;
    case 'accessories':
      return <Wrench size={size} className={className} />;
    default:
      return <Package size={size} className={className} />;
  }
}
