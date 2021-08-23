export interface SubDocument<T> {
  timestamp: number
  data: T
}

export interface ChartChunk {
  index: number
  min: number
  max: number
}

export interface ChartInput {
  begin: number
  length: number
  n: number
}

export const getChartData = <T>(subDocuments: SubDocument<T>[], input: ChartInput) =>
  parseResults(subDocuments, createChunks(input))

export const createChunks = (input: ChartInput): ChartChunk[] =>
  Array(input.n)
    .fill(null)
    .map((_, index) => ({
      index,
      min: input.begin + input.length * index,
      max: input.begin + (input.length * (index + 1) - 1)
    }))

export const parseResults = <T>(items: SubDocument<T>[], chunks: ChartChunk[]) => {
  return chunks
    .map((chunk) => {
      const results = items
        .filter((item) => item.timestamp >= chunk.min && item.timestamp <= chunk.max)
        .sort((a, b) => b.timestamp - a.timestamp)

      const [selected] = results
      if (!selected) return null

      return {
        index: chunk.index,
        timestamp: selected.timestamp,
        data: selected.data
      }
    })
    .filter((item) => item)
}
