const csv = require('@fast-csv/parse')
const slugify = require('slugify')
const { parseArgs } = require('util')
const supportedTargets = ['open-webui']

function toOpenWebUI(data) {
  const command = slugify(data.act, { lower: true })

  return {
    "command": `/${command}`,
    "user_id": "",
    "title": data.act,
    "content": data.prompt,
    "timestamp": Math.floor(Date.now() / 1000),
    "access_control": null,
    "user": {}
  }
}

async function fetchAndConvert(f) {
  const url = 'https://github.com/f/awesome-chatgpt-prompts/raw/refs/heads/main/prompts.csv'
  const response = await fetch(url)
  const data = await response.text()
  const prompts = []
  const errors = []

  await new Promise((resolve, reject) => {
    csv.parseString(data, { headers: true })
      .on('error', error => errors.push(error))
      .on('data', row => prompts.push(f(row)))
      .on('end', rowCount => {
        console.log(`Converted ${rowCount} prompts`)
        errors.length > 0 ? reject(errors) : resolve()
      })
  })

  if (errors.length > 0) throw new Error(errors)
  
  return prompts
}

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    o: { type: 'string' },
    output: { type: 'string' },
    t: { type: 'string' },
    target: { type: 'string' },
  },
  strict: true,
  allowPositionals: true,
})

const target = values.t || values.target
if (!target) {
  console.error('Target format must be specified with -t/--target flag')
  process.exit(1)
}

const output = values.o || values.output
if (!output) {
  console.error('Output file path must be specified with -o/--output flag')
  process.exit(1)
}

if (!supportedTargets.includes(target)) {
  console.error(
    `Unsupported target: "${target}" ` +
    `(currently supported targets: ${supportedTargets.map(t => `"${t}"`).join(', ')})`
  )
  process.exit(1)
}

var f

switch (target) {
  case 'open-webui':
    f = toOpenWebUI
    break
}

try {
  const prompts = await fetchAndConvert(f)
  await Bun.write(output, JSON.stringify(prompts, null, 2))
} catch (e) {
  const errors = e.message.split(',').map(e => `* ${e}`)
  console.error(errors.join('\n'))
  process.exit(errors.length)
}
