import { StyleSheet } from 'react-native'

export enum colors {
  darkest = '#000',
  dark = '#2E3338',
  forest = '#0A4028',
  pine = '#13603C',
  leaf = '#277953',
  dew = '#E7F0EC',
  lightest = '#fff',
  clear = 'transparent',
}

export function getFade(duration: string) {
  return StyleSheet.create({
    hide: {
      animationFillMode: 'both',
      animationDuration: duration,
      animationKeyframes: [
        {
          '0%': { opacity: 1, visibility: 'visible' },
          '99%': { opacity: 0, visibility: 'visible' },
          '100%': { visibility: 'hidden' },
        },
      ],
    },
    show: {
      animationFillMode: 'both',
      animationDuration: duration,
      animationKeyframes: [
        {
          '0%': { opacity: 0, visibility: 'hidden' },
          '1%': { opacity: 0, visibility: 'visible' },
          '100%': { opacity: 1, visibility: 'visible' },
        },
      ],
    },
  })
}

export const stdStyles = StyleSheet.create({
  fullScreen: { minHeight: '100vh' },
})
