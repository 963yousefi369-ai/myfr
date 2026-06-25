interface IconProps {
  className?: string
  size?: number
}

export default function TrackerPin({ className = '', size = 24 }: IconProps) {
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
        d="M12 2C8.13401 2 5 5.13401 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13401 15.866 2 12 2Z"
        fill="#1e3a5f"
      />
      <circle cx="12" cy="9" r="3" fill="#10b981" />
    </svg>
  )
}
