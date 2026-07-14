import { LucideIcon } from 'lucide-react'

interface SectionHeaderProps {
  icon: LucideIcon
  title: string
  accentColor?: string
}

export default function SectionHeader({
  icon: Icon,
  title,
  accentColor = 'bg-verde-600',
}: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className={`w-1 h-8 rounded-full ${accentColor}`} />
      <Icon className="w-5 h-5 text-verde-600" />
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
    </div>
  )
}
