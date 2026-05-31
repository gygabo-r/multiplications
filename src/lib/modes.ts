import type { Mode } from './tables'

export interface ModeConfig {
  id: Mode
  label: string
  symbol: string
  desc: string
  badgeColor: string
}

export const RAINBOW = ['#FF6F91', '#FF9F45', '#FFC93C', '#33C97E', '#3BC9DB', '#5C7CFA', '#9B6BF5']

export const MODES: ModeConfig[] = [
  { id: 'multiply', label: 'Szorzás',     symbol: '×', desc: '1×n – 10×n',        badgeColor: RAINBOW[0] },
  { id: 'add',      label: 'Összeadás',   symbol: '+', desc: '1+n – 10+n',        badgeColor: RAINBOW[3] },
  { id: 'subtract', label: 'Kivonás',     symbol: '−', desc: 'eredmény 1 – 10',   badgeColor: RAINBOW[5] },
]

export function getModeConfig(id: Mode): ModeConfig {
  return MODES.find(m => m.id === id) ?? MODES[0]
}
