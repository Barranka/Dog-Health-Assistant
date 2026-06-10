import {
  BookOpen,
  CalendarDays,
  CalendarPlus,
  CircleAlert,
  HeartPulse,
  Home,
  PawPrint,
  Settings,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import type { TranslationKey } from '../../i18n/dictionaries.js';

export interface NavigationItem {
  to: string;
  labelKey: TranslationKey;
  icon: LucideIcon;
  end?: boolean;
}

export const primaryNavigationItems: ReadonlyArray<NavigationItem> = [
  {
    to: '/',
    labelKey: 'navigation.home',
    icon: Home,
    end: true,
  },
  {
    to: '/dogs',
    labelKey: 'navigation.dogs',
    icon: PawPrint,
  },
  {
    to: '/calendar',
    labelKey: 'navigation.calendar',
    icon: CalendarDays,
  },
  {
    to: '/health',
    labelKey: 'navigation.health',
    icon: HeartPulse,
  },
  {
    to: '/knowledge',
    labelKey: 'navigation.knowledge',
    icon: BookOpen,
  },
] as const;

export const appNavigationItems: ReadonlyArray<NavigationItem> = [
  ...primaryNavigationItems,
  {
    to: '/heat-cycles',
    labelKey: 'navigation.heatCycles',
    icon: CalendarPlus,
  },
  {
    to: '/symptoms',
    labelKey: 'navigation.symptoms',
    icon: CircleAlert,
  },
  {
    to: '/settings',
    labelKey: 'navigation.settings',
    icon: Settings,
  },
] as const;
