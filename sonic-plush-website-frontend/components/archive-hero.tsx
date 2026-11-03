import type { Plush } from '@/lib/plushies'

export function ArchiveHero({ plushies }: { plushies: Plush[] }) {
  const years = plushies.map((p) => p.releaseyear).filter((y): y is number => y !== null)
  const first = years.length ? Math.min(...years) : null
  const last = years.length ? Math.max(...years) : null
  const sets = new Set(plushies.map((p) => p.set)).size
  const characters = new Set(plushies.map((p) => p.character)).size

  const stats = [
    { label: 'plushies', value: plushies.length },
    { label: 'sets', value: sets },
    { label: 'characters', value: characters },
  ]

  return (
    <header className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pt-6 pb-14 md:pb-20">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="size-5 rounded-full border-4 border-accent" />
          <span className="font-heading text-lg font-bold tracking-tight">Blue Blur Archive</span>
        </div>

        <div className="flex flex-col gap-6">
          <h1 className="max-w-3xl font-heading text-5xl font-extrabold leading-none tracking-tight text-balance md:text-7xl">
            Every Japanese Sonic Plush
            {first && last ? (
              <>
                , <span className="text-accent">{first}</span> to{' '}
                <span className="text-accent">{last}</span>.
              </>
            ) : (
              '.'
            )}
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-pretty opacity-85">
            From the original SEGASonic sets to the latest releases. Every plush is
            listed under its release year and set, with variants marked.
          </p>
        </div>

        {plushies.length > 0 && (
          <dl className="flex flex-wrap gap-x-10 gap-y-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-baseline gap-2">
                <dt className="order-2 text-sm opacity-80">{stat.label}</dt>
                <dd className="font-heading text-3xl font-bold tabular-nums">{stat.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </header>
  )
}
