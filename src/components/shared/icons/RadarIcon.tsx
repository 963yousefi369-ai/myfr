interface IconProps {
  className?: string
  size?: number
}

export default function RadarIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="12" r="10" stroke="#1e3a5f" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="6" stroke="#1e3a5f" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2" fill="#10b981" />
      <line x1="12" y1="2" x2="12" y2="12" stroke="#10b981" strokeWidth="1.5" />
      <line x1="12" y1="12" x2="18.93" y2="8" stroke="#1e3a5f" strokeWidth="1" strokeDasharray="2 2" />
    </svg>
  )
}
