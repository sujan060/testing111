import * as React from 'react'
import { useInView } from 'react-intersection-observer'
import { StyleSheet, Text, View } from 'react-native'
import { H1, H4 } from 'src/fonts/Fonts'
import { NameSpaces, useTranslation } from 'src/i18n'
import { Cell, GridRow, Spans } from 'src/layout/GridRow'
import { fonts, standardStyles } from 'src/styles'
import { getFade } from './standards'

const THRESH = [0.3, 1]

export default function Intro() {
  const [ref, inView] = useInView({ threshold: THRESH })
  const { t } = useTranslation(NameSpaces.cambio)

  return (
    <div ref={ref}>
      <View>
        <GridRow allStyle={styles.root}>
          <Cell span={Spans.half} tabletSpan={Spans.twoThird}>
            <View style={inView ? fade.show : fade.hide}>
              <H1>{t('heading')}</H1>
              <H4 style={standardStyles.elementalMargin}>{t('subHeading')}</H4>
              <Text style={fonts.p}>{t('introduction')}</Text>
            </View>
          </Cell>
        </GridRow>
      </View>
    </div>
  )
}

const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
})

const fade = getFade('400ms')
