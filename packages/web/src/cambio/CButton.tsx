import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native'
import { colors } from 'src/cambio/standards'
import { fonts } from 'src/styles'

export enum Kind {
  dark,
  light,
}

interface Props {
  onPress?: () => void
  href?: string
  kind: Kind
  children: React.ReactNode
  style?: StyleProp<TextStyle>
}

export default function CButton({ children, href, onPress, kind, style }: Props) {
  const theme = kind === Kind.light ? styles.light : styles.dark
  return (
    <Text style={[fonts.navigation, styles.root, theme, style]} href={href} onPress={onPress}>
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  root: {
    maxWidth: 225,
    marginVertical: 8,
    borderRadius: 3,
    paddingVertical: 12,
    paddingHorizontal: 16,
    zIndex: 150,
  },
  dark: {
    color: colors.lightest,
    backgroundColor: colors.pine,
  },
  light: {
    color: colors.forest,
    backgroundColor: colors.dew,
  },
})
