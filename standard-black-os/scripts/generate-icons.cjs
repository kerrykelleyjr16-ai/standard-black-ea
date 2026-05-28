const { createCanvas } = (() => {
  try { return require('canvas') } catch { return null }
})() || {}
const fs = require('fs')
const path = require('path')

const iconsDir = path.join(__dirname, '../public/icons')
fs.mkdirSync(iconsDir, { recursive: true })

if (createCanvas) {
  function generateIcon(size) {
    const canvas = createCanvas(size, size)
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#050505'
    ctx.fillRect(0, 0, size, size)
    const pad = Math.floor(size * 0.18)
    const inner = size - pad * 2
    ctx.fillStyle = '#C9A24A'
    ctx.fillRect(pad, pad, inner, inner)
    ctx.fillStyle = '#050505'
    ctx.font = `bold ${Math.floor(size * 0.35)}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('SB', size / 2, size / 2)
    return canvas.toBuffer('image/png')
  }
  fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), generateIcon(192))
  fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), generateIcon(512))
  console.log('Icons generated with canvas.')
} else {
  // Minimal 1x1 transparent PNG fallback — replace with real icons later
  const minimalPng = Buffer.from(
    '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c489' +
    '0000000a49444154789c6260000000020001e221bc330000000049454e44ae426082', 'hex'
  )
  fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), minimalPng)
  fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), minimalPng)
  console.log('Placeholder icons written. Install `canvas` npm package for real icons.')
}
