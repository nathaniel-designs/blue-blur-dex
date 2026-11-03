'use client'

import { useMemo, useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SetCard } from '@/components/set-card'
import { CharacterIcon } from '@/components/character-icon'
import { characterIcons } from '@/lib/character-icons'
import { countBy, groupByYear, type Plush } from '@/lib/plushies'

export function PlushArchive({ plushies }: { plushies: Plush[] }) {
  const [query, setQuery] = useState('')
  const [character, setCharacter] = useState('all')
  const [variantsOnly, setVariantsOnly] = useState(false)

  const characters = useMemo(() => countBy(plushies, (p) => p.character), [plushies])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return plushies.filter((p) => {
      if (character !== 'all' && p.character !== character) return false
      if (variantsOnly && !p.variation) return false
      if (!q) return true
      return [p.character, p.set, p.variation ?? '', String(p.releaseyear ?? '')]
        .join(' ')
        .toLowerCase()
        .includes(q)
    })
  }, [plushies, query, character, variantsOnly])

  const years = useMemo(() => groupByYear(filtered), [filtered])
  const hasFilters = query !== '' || character !== 'all' || variantsOnly

  function reset() {
    setQuery('')
    setCharacter('all')
    setVariantsOnly(false)
  }

  return (
    <section aria-labelledby="archive-heading">
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4">
          <h2 id="archive-heading" className="sr-only">
            Collection
          </h2>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <label className="relative flex-1">
              <span className="sr-only">Search plushies</span>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by character, set, variant, or year"
                className="h-10 w-full rounded-lg border border-input bg-card pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>
            <div className="flex items-center gap-3">
              <label className="relative">
                <span className="sr-only">Filter by character</span>
                <select
                  value={character}
                  onChange={(e) => setCharacter(e.target.value)}
                  className="h-10 appearance-none rounded-lg border border-input bg-card pr-9 pl-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="all">All characters</option>
                  {characters.map(([name, count]) => (
                    <option key={name} value={name}>
                      {name} ({count})
                    </option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
                />
              </label>
              <button
                type="button"
                aria-pressed={variantsOnly}
                onClick={() => setVariantsOnly((v) => !v)}
                className="h-10 rounded-lg border border-input bg-card px-3 text-sm font-medium whitespace-nowrap transition-colors aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
              >
                Variants only
              </button>
            </div>
          </div>

          <div
            role="group"
            aria-label="Quick filter by character"
            className="-mx-4 flex gap-2 overflow-x-auto px-4"
          >
            {Object.entries(characterIcons).map(([name, icon]) => {
              const active = character === name
              return (
                <button
                  key={name}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCharacter(active ? 'all' : name)}
                  className="flex shrink-0 items-center gap-2 rounded-full border border-input bg-card py-1 pr-3.5 pl-1 text-sm font-medium transition-colors hover:border-primary aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
                >
                  <span className="flex size-8 items-center justify-center rounded-full bg-background">
                    <CharacterIcon character={name} className="size-7" />
                  </span>
                  {icon.short}
                </button>
              )
            })}
          </div>

          {years.length > 0 && (
            <nav aria-label="Jump to year" className="-mx-4 overflow-x-auto px-4">
              <ul className="flex gap-1.5">
                {years.map((group) => (
                  <li key={group.year ?? 'unknown'}>
                    <a
                      href={`#year-${group.year ?? 'unknown'}`}
                      className="block rounded-md px-2 py-1 text-sm font-medium tabular-nums text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      {group.year ?? 'Undated'}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <p className="pt-6 text-sm text-muted-foreground" aria-live="polite">
          Showing {filtered.length} of {plushies.length} plushies
        </p>

        {years.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <p className="font-heading text-2xl font-semibold">No plushies match those filters</p>
            {hasFilters && <Button onClick={reset}>Clear filters</Button>}
          </div>
        ) : (
          years.map((group) => (
            <section
              key={group.year ?? 'unknown'}
              id={`year-${group.year ?? 'unknown'}`}
              aria-labelledby={`year-heading-${group.year ?? 'unknown'}`}
              className="grid gap-6 border-b border-border py-10 last:border-b-0 lg:grid-cols-[13rem_1fr]"
            >
              <div className="flex flex-col gap-1 self-start lg:sticky lg:top-36">
                <h3
                  id={`year-heading-${group.year ?? 'unknown'}`}
                  className="font-heading text-6xl font-extrabold leading-none tracking-tight tabular-nums text-primary"
                >
                  {group.year ?? 'Undated'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {group.sets.length} {group.sets.length === 1 ? 'set' : 'sets'} · {group.count}{' '}
                  {group.count === 1 ? 'plush' : 'plushies'}
                </p>
              </div>
              <div className="grid items-start gap-4 md:grid-cols-2">
                {group.sets.map((set) => (
                  <SetCard key={set.name} set={set} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </section>
  )
}
