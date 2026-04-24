/**
 * Extra cardio — 10 exercises from ideas.md
 *
 * Two from each band: easy (sum, unique), medium (sort titles, chunk),
 * harder (running total, top N), hard (inverted index, group states).
 * Plus: partition + find by id (ideas #9 and #4) to reach 10.
 */


// ─── Testing ───
export function lowercaseHello(name: string) {
  return [name].reduce((a, i) => {
    if (i) {
      return `${a} ${i.toLowerCase()}`
    }
    return a
  }, 'hello')
}
// ─── Easy ───

/** Sum an array of numbers. */
export function sum(numbers: number[]): number {
  return numbers.reduce((a, i) => a + i, 0)
}

/** Remove duplicates, keep first occurrence order (use strict equality). */
export function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items))
}

/** Split into elements that satisfy `pred` vs those that do not (original relative order preserved in each bucket). */
export function partition<T>(arr: T[], pred: (value: T) => boolean): { pass: T[]; fail: T[] } {
  return arr.reduce((a, i) => {
    a[pred(i) ? 'pass' : 'fail'].push(i)
    return a
  }, { pass: [], fail: [] } as { pass: T[]; fail: T[] })
}

export type User = { id: string; name: string }

/** Return the user’s `name` for `id`, or `null` if not found. */
export function findNameById(users: User[], id: string): string | null {
  return users.reduce((a, i) => {
    if (i.id === id) {
      return i.name
    }
    return a
  }, null as null | string)
}

// ─── Medium ───

/**
 * Sort movie titles as if leading "The ", "A ", or "An " were not present.
 * Compare the remainder (case-sensitive OK; tests use consistent casing).
 */
export function sortTitlesIgnoringArticles(titles: string[]): string[] {
  return [...titles].sort((a, b) => a.localeCompare(b))
}

/** Split `arr` into consecutive chunks of length `size` (last chunk may be shorter). Assume `size > 0`. */
export function chunk<T>(arr: T[], size: number): T[][] {
  // let result: T[][] = []
  //
  // for (let i = 0; i < Math.ceil(arr.length / size); i++) {
  //   result.push(arr.slice(i * size, (i + 1) * size))
  //
  // }
  // return result
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => i).reduce((a, i) => {
    a.push(arr.slice(i * size, (i + 1) * size))
    return a
  }, [] as T[][])
}

// ─── Harder ───

/** Cumulative sum at each step. */
export function runningTotal(values: number[]): number[] {
  const { result } = values.reduce((a, i) => {
    a.cache += i
    a.result.push(a.cache)
    return a
  }, { result: [], cache: 0 } as { result: number[], cache: number })
  return result
}

export type ScoreRow = { studentId: string; subject: string; score: number }

/**
 * For each subject, take the top `n` scores (highest first). If fewer than `n` rows exist, return all.
 * Ties: stable by original order in the input array.
 */
export function topNPerSubject(rows: ScoreRow[], n: number): Record<string, { studentId: string; score: number }[]> {
  return Object.fromEntries(Array.from(rows.reduce((a, { subject, ...i }) => {
    a.set(subject, [...(a.get(subject) || []), i])
    return a
  }, new Map<string, { studentId: string; score: number }[]>).entries()).reduce((a, i) => {
    i[1] = i[1].sort((a, b) => b.score - a.score).slice(0, n)
    a.push(i)
    return a
  }, [] as [string, { studentId: string; score: number }[]][]))
}

// ─── Hard ───

export type DocWords = { id: string; words: string[] }

/**
 * Word → sorted list of document ids that contain that word (each id once per word).
 */
export function invertedIndex(docs: DocWords[]): Record<string, string[]> {
  const result = Object.fromEntries(docs.reduce((a, i) => {
    for (const word of i.words) {
      a.set(word, [...a.get(word) || [], i.id].sort((a, b) => a.localeCompare(b)))
    }
    return a
  }, new Map<string, string[]>).entries())
  return result
}

export type City = { name: string; state: string; population: number }

/**
 * States ordered by **total** population (descending). Each entry lists that state’s city **names**
 * sorted **alphabetically** (A→Z).
 */
export function groupStatesByPopulation(cities: City[]): { state: string; totalPopulation: number; cities: string[] }[] {
  return Array.from(cities.reduce((a, i) => {
    const state = a.get(i.state) || { totalPopulation: 0, cities: [] } as { totalPopulation: number, cities: string[] }
    state.totalPopulation += i.population
    state.cities = [...state.cities, i.name].sort((a, b) => a.localeCompare(b))
    a.set(i.state, state)
    return a
  }, new Map<string, { totalPopulation: number, cities: string[] }>).entries()).sort((a, b) => a[0].localeCompare(b[0])).reduce((a, [state, value]) => {
    a.push({

      state,
      ...value
    } satisfies { state: string; totalPopulation: number; cities: string[] })
    return a
  }, [] as { state: string; totalPopulation: number; cities: string[] }[])
}
