import {
  Award,
  BellRing,
  BookOpen,
  ConciergeBell,
  CreditCard,
  Heart,
  Hourglass,
  Leaf,
  ListChecks,
  MapPin,
  SlidersHorizontal,
  Smartphone,
  SplitSquareHorizontal,
  type LucideIcon,
} from "lucide-react";

const ICONS = {
  phone: Smartphone,
  menu: BookOpen,
  checklist: ListChecks,
  card: CreditCard,
  pin: MapPin,
  options: SlidersHorizontal,
  leaf: Leaf,
  pace: Hourglass,
  updates: BellRing,
  service: ConciergeBell,
  split: SplitSquareHorizontal,
  rewards: Award,
  favorite: Heart,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

/** Decorative line icon in a soft gold badge. Hidden from assistive tech. */
export function Icon({ name }: { name: IconName }) {
  const Glyph = ICONS[name];
  return (
    <span className="icon-badge" aria-hidden="true">
      <Glyph size={22} strokeWidth={1.5} />
    </span>
  );
}
