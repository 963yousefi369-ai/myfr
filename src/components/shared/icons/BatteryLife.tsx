interface IconProps {
  className?: string
  size?: number
}

export default function BatteryLife({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="2" y="7" width="18" height="10" rx="2" stroke="#1e3a5f" strokeWidth="1.5" />
      <rect x="22" y="10" width="2" height="4" rx="1" fill="#1e3a5f" />
      <rect x="4" y="9" width="8" height="6" rx="1" fill="#10b981" />
    </svg>
  )
}
