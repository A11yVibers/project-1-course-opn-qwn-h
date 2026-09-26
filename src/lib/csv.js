export function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  let i = 0

  while (i < text.length) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i += 2
        } else {
          inQuotes = false
          i += 1
        }
      } else {
        field += c
        i += 1
      }
    } else if (c === '"') {
      inQuotes = true
      i += 1
    } else if (c === ',') {
      row.push(field)
      field = ''
      i += 1
    } else if (c === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
      i += 1
    } else if (c === '\r') {
      i += 1
    } else {
      field += c
      i += 1
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  const headers = rows.shift().map((h) => h.trim())
  return rows
    .filter((r) => r.some((cell) => cell.trim() !== ''))
    .map((r) => Object.fromEntries(headers.map((h, idx) => [h, (r[idx] ?? '').trim()])))
}
