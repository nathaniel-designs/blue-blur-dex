import Image from 'next/image'
import { characterIcons } from '@/lib/character-icons'
import { cn } from '@/lib/utils'

export function CharacterIcon({ character, className }: { character: string; className?: string }) {
  const icon = characterIcons[character]

  if (!icon) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary font-heading text-xs font-bold text-muted-foreground',
          className,
        )}
      >
        {character.charAt(0)}
      </span>
    )
  }

  return (
    <Image
      src={icon.src || '/placeholder.svg'}
      alt=""
      width={64}
      height={64}
      className={cn('size-8 shrink-0 object-contain', className)}
    />
  )
}
