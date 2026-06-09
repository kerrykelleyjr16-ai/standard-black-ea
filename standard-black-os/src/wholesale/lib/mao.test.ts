import { describe, it, expect } from 'vitest'
import { calculateMAO } from './mao'

describe('calculateMAO', () => {
  it('computes ARV*margin - repairs - fee', () => {
    expect(calculateMAO(200000, 0.7, 30000, 10000)).toBe(100000)
  })
})
