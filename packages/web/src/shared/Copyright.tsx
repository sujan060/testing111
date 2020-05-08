import * as React from 'react'
import { StyleSheet, Text, TextStyle } from 'react-native'
import { NameSpaces, useTranslation } from 'src/i18n'
import { useScreenSize } from 'src/layout/ScreenSize'
import { fonts, textStyles } from 'src/styles'

interface Props {
  style?: TextStyle
}

export function Copyright({ style }: Props) {
  const year = new Date().getFullYear()
  const { t } = useTranslation(NameSpaces.common)
  const { isMobile } = useScreenSize()
  return (
    <Text style={[fonts.legal, styles.copyright, isMobile && textStyles.center, style]}>
      {t('footer.copyright', { year })}
    </Text>
  )
}

const styles = StyleSheet.create({
  copyright: {
    zIndex: 10, // ensure copyright is above the sliding div from ChangeStory animation
  },
})
