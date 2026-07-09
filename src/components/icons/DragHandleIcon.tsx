interface DragHandleIconProps {
  className?: string;
}

export function DragHandleIcon({ className }: DragHandleIconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <rect x="1" y="2" width="14" height="1.5" rx="0.75" />
      <rect x="1" y="7.25" width="14" height="1.5" rx="0.75" />
      <rect x="1" y="12.5" width="14" height="1.5" rx="0.75" />
    </svg>
  );
}
