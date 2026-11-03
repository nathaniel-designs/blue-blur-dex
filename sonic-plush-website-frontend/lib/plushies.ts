export type Plush = {
  id: number
  set: string
  releaseyear: number | null
  character: string
  variation: string | null
}

export type SetGroup = { name: string; plushies: Plush[] }
export type YearGroup = { year: number | null; sets: SetGroup[]; count: number }

const PLUSH_API_URL =
  process.env.PLUSH_API_URL ?? 'https://blue-blur-db-l9xbv.ondigitalocean.app/plushies/all'

export async function getPlushies(): Promise<Plush[]> {
  const res = await fetch(PLUSH_API_URL, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`Plush API responded with ${res.status}`)
  const data: unknown = await res.json()
  if (!Array.isArray(data)) throw new Error('Plush API returned an unexpected shape')
  return data as Plush[]
}

export function groupByYear(plushies: Plush[]): YearGroup[] {
  const years = new Map<number | null, Map<string, Plush[]>>()
  for (const plush of [...plushies].sort((a, b) => a.id - b.id)) {
    const year = plush.releaseyear ?? null
    if (!years.has(year)) years.set(year, new Map())
    const sets = years.get(year)!
    if (!sets.has(plush.set)) sets.set(plush.set, [])
    sets.get(plush.set)!.push(plush)
  }
  return [...years.entries()]
    .sort(([a], [b]) => (a ?? Infinity) - (b ?? Infinity))
    .map(([year, sets]) => {
      const setGroups = [...sets.entries()].map(([name, items]) => ({ name, plushies: items }))
      return { year, sets: setGroups, count: setGroups.reduce((n, s) => n + s.plushies.length, 0) }
    })
}

export function countBy<T>(items: T[], key: (item: T) => string) {
  const counts = new Map<string, number>()
  for (const item of items) counts.set(key(item), (counts.get(key(item)) ?? 0) + 1)
  return [...counts.entries()].sort((a, b) => b[1] - a[1])
}
