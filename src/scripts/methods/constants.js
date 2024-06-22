export const PHONE_WIDTH_BREAKPOINT = 575
export const NARROW_WIDTH_BREAKPOINT = 1200
export const ASIDE_WIDTH = 300

export const DEFAULT_ACCENT_COLOR = '#8750db'

export const THREE_COLUMNS_MODE = 3
export const TWO_COLUMNS_MODE = 2

export const AUTO_ACCENT_COLOR_TYPE_SATURATED = 'saturated'
export const AUTO_ACCENT_COLOR_TYPE_GENERAL = 'general'

export const THEME_LIGHT = 'light'
export const THEME_DARK = 'dark'

export const COLORS = [
  '#ff9500',
  '#e33161',
  '#e02e96',
  '#8930d6',
  '#0080ff',
  '#3edbd6',
  '#26de83',
  '#9ad03d',
]

export const DEFAULT_SETTINGS = {
  layout: {
    social_mode: THREE_COLUMNS_MODE,
    dropdown_hidden_sources: false,
    bookmarks_grid: {
      rows: 2,
      columns: 6
    },
  },
  wallpaper: {
    value: null,
    fetch: false,
  },
  theme: null,
  accent_color: {
    value: DEFAULT_ACCENT_COLOR,
    auto: false,
    auto_type: AUTO_ACCENT_COLOR_TYPE_SATURATED
  },
  darken_wallpaper: {
    value: false,
    start: 21,
    end: 7,
  },
}