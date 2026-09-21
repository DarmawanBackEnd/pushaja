<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:pushaja-design-system-rules -->
# PushAja Design System & Iconography Guidelines

1. **Strictly No Emojis/Emoticons as UI Icons**:
   - Under no circumstances should emojis or unicode symbols (e.g. 🔥, ➔, ★, 🏆, ⚠️, ➕, 📅) be used as icon representations in UI elements, buttons, badges, tables, or navigation.
   - Always use `lucide-react` icons (e.g. `<Flame />`, `<ArrowRight />`, `<Star />`, `<Trophy />`, `<AlertTriangle />`, `<PlusCircle />`, `<Calendar />`, `<Clock />`, `<Sparkles />`).
   - Sizing standards: Micro icons (`w-3 h-3`), Small/Inline (`w-3.5 h-3.5` to `w-4 h-4`), Standard button/menu (`w-4 h-4` to `w-5 h-5`), Hero/Feature (`w-6 h-6` to `w-8 h-8`).
   - Ensure accessibility: add `aria-hidden="true"` for decorative icons, or provide accessible titles/labels when icons convey action without visible text.

2. **Design Standards & Aesthetics (UI/UX Pro Max)**:
   - Modern, premium tech SaaS look with crisp typography, balanced spacing, sleek dark/light card contrasts, and subtle borders (`border-slate-200` / `border-white/10`).
   - Primary brand color: PushAja Royal Blue (`#1E40AF` / `rgb(30, 64, 175)`) paired with high-energy Lime Accent (`#A3E635`).
   - Micro-interactions: Smooth hover scaling (`hover:scale-[1.02] active:scale-[0.98] transition-all`), elegant backdrop blurs (`backdrop-blur-md`), and clean focus states.
<!-- END:pushaja-design-system-rules -->

