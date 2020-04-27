import * as React from 'react'
import { useInView } from 'react-intersection-observer'
import { StyleSheet, Text, View } from 'react-native'
import { animated, config, useSpring } from 'react-spring'
import BusToken from 'src/cambio/BusToken'
import { H1, H4 } from 'src/fonts/Fonts'
import { NameSpaces, useTranslation } from 'src/i18n'
import { Cell, GridRow, Spans } from 'src/layout/GridRow'
import { colors, fonts, standardStyles } from 'src/styles'

const AnimatedView = animated.div

export default function Curitiba() {
  const [ref, inView] = useInView({ threshold: 0.5 })

  const busToken = useSpring({
    transform: inView ? 'rotate(0)' : 'rotate(180deg)',
    width: 'fit-content',
    config: config.slow,
  })
  const contentStyle = useSpring({
    opacity: inView ? 1 : 0,
    config: config.molasses,
  })

  const { t } = useTranslation(NameSpaces.cambio)

  return (
    <>
      {' '}
      <GridRow allStyle={styles.root}>
        <Cell span={Spans.half} tabletSpan={Spans.twoThird}>
          <AnimatedView style={contentStyle}>
            <AnimatedView style={busToken}>
              <BusToken color={colors.dark} size={53} />
            </AnimatedView>
            <View>
              <H1 style={styles.title}>{t('heading')}</H1>
              <H4 style={standardStyles.elementalMargin}>{t('subHeading')}</H4>
              <Text style={fonts.p}>{t('introduction')}</Text>
            </View>
          </AnimatedView>
        </Cell>
      </GridRow>
      <div ref={ref} style={{ height: '200vh', marginBottom: '50vh' }} />
    </>
  )
}

const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    height: '100vh',
  },
  title: {
    fontSize: 72,
    lineHeight: 80,
  },
})
