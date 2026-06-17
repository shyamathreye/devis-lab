// Each theme re-skins the accent colors + background gradient and supplies a mascot.
export const THEMES = {
  unicorn: {
    id: 'unicorn',
    name: 'Unicorns',
    emoji: '🦄',
    blurb: 'Magic & rainbows',
    accent: '#ff4ecd',
    accent2: '#b06bff',
    bgFrom: '#1a1033',
    bgTo: '#3a1b5e',
    critter: '🦄',
    critters: ['🦄', '👑', '🌈', '⭐', '🧚', '🍭'],
  },
  animals: {
    id: 'animals',
    name: 'Animals',
    emoji: '🐶',
    blurb: 'Cuddly friends',
    accent: '#aaff3d',
    accent2: '#ffb13d',
    bgFrom: '#10231a',
    bgTo: '#1f3a1b',
    critter: '🐶',
    critters: ['🐶', '🐱', '🐰', '🐼', '🦊', '🐸'],
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    emoji: '🐠',
    blurb: 'Under the sea',
    accent: '#22e3ff',
    accent2: '#3df0c0',
    bgFrom: '#04263a',
    bgTo: '#063a4e',
    critter: '🐠',
    critters: ['🐠', '🐬', '🐙', '🦀', '🐚', '🧜'],
  },
  space: {
    id: 'space',
    name: 'Space',
    emoji: '🚀',
    blurb: 'Stars & planets',
    accent: '#ff4ecd',
    accent2: '#4e7bff',
    bgFrom: '#0a0a2a',
    bgTo: '#1a1048',
    critter: '🚀',
    critters: ['🚀', '⭐', '🪐', '🌙', '☄️', '👽'],
  },
}

export const THEME_LIST = Object.values(THEMES)

// Apply a theme's CSS variables to the document root.
export function applyTheme(theme) {
  if (!theme) return
  const root = document.documentElement
  root.style.setProperty('--accent', theme.accent)
  root.style.setProperty('--accent2', theme.accent2)
  root.style.setProperty('--bg-from', theme.bgFrom)
  root.style.setProperty('--bg-to', theme.bgTo)
}
