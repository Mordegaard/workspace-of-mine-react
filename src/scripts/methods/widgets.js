import { Clock } from 'scripts/components/Main/Widgets/Clock'

export const PARAM_TYPE_DROPDOWN = 'dropdown'

export const WIDGETS = {
  clock: {
    name: 'Годинник',
    component: Clock,
    params: {
      vertical_position: {
        name: 'Вертикальне положення',
        type: PARAM_TYPE_DROPDOWN,
        defaultValue: 'bottom',
        options: {
          top: 'Зверху',
          bottom: 'Знизу',
        }
      },
      horizontal_position: {
        name: 'Горизонтальне положення',
        type: PARAM_TYPE_DROPDOWN,
        defaultValue: 'left',
        options: {
          left: 'Зліва',
          center: 'По центру',
          right: 'Справа'
        }
      },
      color: {
        name: 'Колір',
        type: PARAM_TYPE_DROPDOWN,
        defaultValue: 'white',
        options: {
          white: 'Білий',
          black: 'Чорний',
        }
      },
    }
  }
}