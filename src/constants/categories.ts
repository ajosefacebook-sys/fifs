import { Category } from '@/types/task.types';

export interface CategoryInfo {
  value: Category;
  label: string;
  icon: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { value: 'plumbing', label: 'Plumbing', icon: 'droplet', color: '#3B82F6' },
  { value: 'electrical', label: 'Electrical', icon: 'zap', color: '#EAB308' },
  { value: 'hvac', label: 'HVAC', icon: 'wind', color: '#06B6D4' },
  { value: 'generator', label: 'Generator', icon: 'fuel', color: '#F97316' },
  { value: 'smart-systems', label: 'Smart Systems', icon: 'monitor', color: '#8B5CF6' },
  { value: 'cleaning', label: 'Cleaning', icon: 'sparkles', color: '#22C55E' },
  { value: 'carpentry', label: 'Carpentry', icon: 'hammer', color: '#A16207' },
  { value: 'logistics', label: 'Logistics', icon: 'truck', color: '#64748B' },
];

export const CATEGORY_MAP: Record<Category, CategoryInfo> = Object.fromEntries(
  CATEGORIES.map(c => [c.value, c])
) as Record<Category, CategoryInfo>;
