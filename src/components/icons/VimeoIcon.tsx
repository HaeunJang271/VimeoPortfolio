interface VimeoIconProps {
  className?: string;
}

export function VimeoIcon({ className }: VimeoIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M23.977 14.158l-1.406-5.092c-.281-.967-1.033-1.651-1.978-1.651-.744 0-1.393.353-1.82.92-.427-.567-1.076-.92-1.82-.92-.945 0-1.697.684-1.978 1.651L13.591 4.5h-4.182l3.591 13.658h4.182L23.977 14.158z" />
    </svg>
  );
}
