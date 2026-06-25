interface IconProps {
  className?: string
  size?: number
}

export default function RoutePath({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M4 20C4 20 8 16 12 12C16 8 20 4 20 4"
        stroke="#1e3a5f"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="4 3"
      />
      <circle cx="4" cy="20" r="2.5" fill="#10b981" />
      <circle cx="20" cy="4" r="2.5" fill="#f59e0b" />
    </svg>
  )
}
