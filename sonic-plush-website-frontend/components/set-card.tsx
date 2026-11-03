import type { SetGroup } from '@/lib/plushies'
import { CharacterIcon } from '@/components/character-icon'

export function SetCard({ set }: { set: SetGroup }) {
  return (
    <article className="flex flex-col rounded-xl border border-border bg-card text-card-foreground">
      <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
        <h3 className="font-heading text-lg font-semibold leading-snug text-pretty">{set.name}</h3>
        <span className="shrink-0 rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold tabular-nums text-accent-foreground">
          {set.plushies.length}
        </span>
      </header>
      <ul className="flex flex-col divide-y divide-border">
        {set.plushies.map((plush) => (
          <li key={plush.id} className="flex items-center gap-3 px-5 py-3">
            <span className="w-8 shrink-0 text-xs tabular-nums text-muted-foreground">
              #{plush.id}
            </span>
            <CharacterIcon character={plush.character} />
            <div className="flex min-w-0 flex-col">
              <span className="font-medium leading-snug">{plush.character}</span>
              {plush.variation && (
                <span className="text-sm leading-relaxed text-primary">{plush.variation}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </article>
  )
}
