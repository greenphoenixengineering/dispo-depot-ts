interface TagChipProps {
    label: string
    color?: string
  }
  
  export function TagChip({ label, color = "green" }: TagChipProps) {
    const colorClasses = {
      green: "bg-green-100 text-green-800",
      blue: "bg-blue-100 text-blue-800",
      purple: "bg-purple-100 text-purple-800",
      yellow: "bg-yellow-100 text-yellow-800",
      red: "bg-red-100 text-red-800",
    }
  
    const colorClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.green
  
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {label}
      </span>
    )
  }
  