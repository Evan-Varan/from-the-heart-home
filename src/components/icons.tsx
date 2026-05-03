import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  ArrowLeft02Icon,
  ArrowRight02Icon,
  ArrowUp01Icon,
  BookOpenTextIcon,
  Brain02Icon,
  BubbleChatFavouriteIcon,
  Calculator01Icon,
  CalendarLove02Icon,
  Call02Icon,
  Cancel01Icon,
  ChartIncreaseIcon,
  CheckmarkCircle02Icon,
  CircleIcon,
  ClipboardIcon,
  GraduationScrollIcon,
  HandGripIcon,
  HeartCheckIcon,
  LanguageSkillIcon,
  Location04Icon,
  LockKeyIcon,
  MailLove02Icon,
  Menu09Icon,
  MinusSignIcon,
  MoreHorizontalIcon,
  Mortarboard02Icon,
  PanelLeftIcon,
  PencilRulerIcon,
  Search02Icon,
  SecurityCheckIcon,
  StarIcon,
  StudentsIcon,
  TestTubeDiagonalIcon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons";
import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: string | number;
  strokeWidth?: number;
};

function createIcon(icon: IconSvgElement, defaultStrokeWidth = 1.65) {
  const AppIcon = React.forwardRef<SVGSVGElement, IconProps>(
    ({ className, size, strokeWidth = defaultStrokeWidth, ...props }, ref) => (
      <HugeiconsIcon
        ref={ref}
        icon={icon}
        className={className}
        size={size ?? "1em"}
        strokeWidth={strokeWidth}
        color="currentColor"
        {...props}
      />
    ),
  );

  AppIcon.displayName = "AppIcon";
  return AppIcon;
}

export const ArrowDown = createIcon(ArrowDown01Icon);
export const ArrowLeft = createIcon(ArrowLeft02Icon);
export const ArrowRight = createIcon(ArrowRight02Icon);
export const ArrowUp = createIcon(ArrowUp01Icon);
export const BookOpen = createIcon(BookOpenTextIcon);
export const Brain = createIcon(Brain02Icon);
export const CalendarHeart = createIcon(CalendarLove02Icon);
export const Calculator = createIcon(Calculator01Icon);
export const Check = createIcon(CheckmarkCircle02Icon, 1.85);
export const ChevronDown = ArrowDown;
export const ChevronLeft = ArrowLeft;
export const ChevronRight = ArrowRight;
export const ChevronUp = ArrowUp;
export const Circle = createIcon(CircleIcon, 1.8);
export const ClipboardCheck = createIcon(ClipboardIcon);
export const DotsSixVertical = createIcon(HandGripIcon);
export const DotsThree = createIcon(MoreHorizontalIcon);
export const EnvelopeSimple = createIcon(MailLove02Icon);
export const Flask = createIcon(TestTubeDiagonalIcon);
export const GraduationCap = createIcon(Mortarboard02Icon);
export const Heart = createIcon(HeartCheckIcon);
export const Languages = createIcon(LanguageSkillIcon);
export const List = createIcon(Menu09Icon);
export const Lock = createIcon(LockKeyIcon);
export const MagnifyingGlass = createIcon(Search02Icon);
export const MapPin = createIcon(Location04Icon);
export const MessageCircleHeart = createIcon(BubbleChatFavouriteIcon);
export const Minus = createIcon(MinusSignIcon);
export const PanelLeft = createIcon(PanelLeftIcon);
export const PencilRuler = createIcon(PencilRulerIcon);
export const Phone = createIcon(Call02Icon);
export const Progress = createIcon(ChartIncreaseIcon);
export const ShieldCheck = createIcon(SecurityCheckIcon);
export const Star = createIcon(StarIcon);
export const Users = createIcon(UserMultiple02Icon);
export const X = createIcon(Cancel01Icon);

export const BookOpenText = BookOpen;
export const ChatCircleText = MessageCircleHeart;
export const ClipboardText = ClipboardCheck;
export const Translate = Languages;
export const UserGroup = createIcon(StudentsIcon);
