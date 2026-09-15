export function parseCsv(text) {
  const src = String(text ?? '').replace(/\r\n?/g, '\n')
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  let i = 0

  while (i < src.length) {
    const ch = src[i]
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          field += '"'
          i += 2
          continue
        }
        inQuotes = false
        i += 1
        continue
      }
      field += ch
      i += 1
      continue
    }
    if (ch === '"') {
      inQuotes = true
      i += 1
      continue
    }
    if (ch === ',') {
      row.push(field)
      field = ''
      i += 1
      continue
    }
    if (ch === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
      i += 1
      continue
    }
    field += ch
    i += 1
  }
  if (field !== '' || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  const filled = rows.filter((r) => r.some((c) => c.trim() !== ''))
  if (filled.length < 2) return []
  const header = filled[0].map((h) => h.trim())
  return filled.slice(1).map((r) =>
    Object.fromEntries(header.map((h, idx) => [h, (r[idx] ?? '').trim()]))
  )
}
