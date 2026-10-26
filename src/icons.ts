import type { LucideIcon } from 'lucide-react';
import {
  CalendarDays,
  CircleHelp,
  Contact,
  FileText,
  LogIn,
  MessageCircle,
  Package,
  PenLine,
  PhoneCall,
  ShoppingCart,
  Users,
  Webhook,
} from 'lucide-react';

// Icons that editors can pick in the CMS
export const icons = {
  'calendar-days': { label: 'Kalender', icon: CalendarDays },
  'circle-help': { label: 'Frågetecken', icon: CircleHelp },
  contact: { label: 'Kontaktkort', icon: Contact },
  'file-text': { label: 'Dokument', icon: FileText },
  'log-in': { label: 'Logga in', icon: LogIn },
  'message-circle': { label: 'Pratbubbla', icon: MessageCircle },
  package: { label: 'Paket', icon: Package },
  'pen-line': { label: 'Penna', icon: PenLine },
  'phone-call': { label: 'Telefon', icon: PhoneCall },
  'shopping-cart': { label: 'Kundvagn', icon: ShoppingCart },
  users: { label: 'Användare', icon: Users },
  webhook: { label: 'Webhook', icon: Webhook },
} satisfies Record<string, { label: string; icon: LucideIcon }>;

export type IconName = keyof typeof icons;

export const iconOptions = Object.entries(icons).map(([value, { label }]) => ({ label, value }));

export const getIcon = (name: string | null | undefined): LucideIcon =>
  icons[name as IconName]?.icon ?? CircleHelp;
