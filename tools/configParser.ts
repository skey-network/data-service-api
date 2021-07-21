import { readFileSync } from 'fs'

export const parseConfig = () =>
  readFileSync('./src/config.ts', 'utf-8')
    .match(/env.[A-Z|_]*\s\?\?\s\'.*\'/g)
    .map((str) => ({
      key: str.split("'")[0].replace('env.', '').replace(' ?? ', ''),
      value: str.split("'")[1]
    }))
