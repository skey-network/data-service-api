import { writeFileSync } from 'fs'
import { parseConfig } from './configParser'

writeFileSync(
  './.env.example',
  parseConfig()
    .map((entry) => `${entry.key}=${entry.value}`)
    .join('\n') + '\n'
)
