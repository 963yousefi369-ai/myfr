interface IconProps {
  className?: string
  size?: number
}

export default function GPSSignal({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="20" r="2" fill="#10b981" />
      <path
        d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8"
        stroke="#1e3a5f"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 12C15.3137 12 18 9.31371 18 6C18 2.68629 15.3137 0 12 0"
        stroke="#1e3a5f"
        strokeWidth="1.5"
        strokeLinecap="round"
        transform="translate(0 2)"
      />
      <path
        d="M12 12C17.5228 12 22 7.52285 22 2"
        stroke="#f59e0b"
        strokeWidth="1.5"
        strokeLinecap="round"
        transform="translate(0 2)"
      />
    </svg>
  )
}
