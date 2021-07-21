import { parseConfig } from './configParser'

const NAME = 'data-service-api'
const PORT = 3000

const vars = parseConfig()
  .map(({ key, value }) => `-e ${key}=${value}`)
  .join(' ')

const buildCommand = `docker build -t ${NAME} .`
const runCommand = `docker run -d --name ${NAME} -p ${PORT}:${PORT} ${vars} ${NAME}`

console.log(buildCommand, '&&', runCommand)
