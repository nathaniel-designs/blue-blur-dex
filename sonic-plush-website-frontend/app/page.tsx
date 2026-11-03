import { ArchiveHero } from '@/components/archive-hero'
import { PlushArchive } from '@/components/plush-archive'
import { getPlushies, type Plush } from '@/lib/plushies'

export default async function Page() {
  let plushies: Plush[] | null = null
  try {
    plushies = await getPlushies()
  } catch (error) {
    console.error('Failed to load plushies:', error)
  }

  return (
    <main className="min-h-dvh">
      <ArchiveHero plushies={plushies ?? []} />
      {plushies ? (
        <PlushArchive plushies={plushies} />
      ) : (
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-24 text-center">
          <h2 className="font-heading text-2xl font-semibold">{"Couldn't reach the plush database"}</h2>
          <p className="text-muted-foreground leading-relaxed">
            The collection API is not responding right now. Refresh in a moment to try again.
          </p>
        </div>
      )}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <p>Blue Blur Dex: a plush archive.</p>
          <p>Sonic the Hedgehog is a trademark of SEGA. Fan project.</p>
        </div>
      </footer>
    </main>
  )
}
