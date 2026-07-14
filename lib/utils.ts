// Simple utility to merge class names without adding a dep on clsx
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}
