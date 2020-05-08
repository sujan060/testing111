import * as React from 'react'
import { useInView } from 'react-intersection-observer'
import { StyleSheet, Text, View } from 'react-native'
import { animated, config, useSpring } from 'react-spring'
import { H1, H4 } from 'src/fonts/Fonts'
import { NameSpaces, useTranslation } from 'src/i18n'
import { Cell, GridRow, Spans } from 'src/layout/GridRow'
import { fonts, standardStyles } from 'src/styles'

const AnimatedView = animated.div

const THRESH = [0.3, 1]

export default function Intro() {
  const [ref, inView] = useInView({ threshold: THRESH })

  const contentStyle = useSpring({
    opacity: inView ? 1 : 0,
    config: config.molasses,
  })

  const { t } = useTranslation(NameSpaces.cambio)

  return (
    <div ref={ref}>
      <View>
        <GridRow allStyle={styles.root}>
          <Cell span={Spans.half} tabletSpan={Spans.twoThird}>
            <AnimatedView style={contentStyle}>
              <View>
                <H1 style={styles.title}>{t('heading')}</H1>
                <H4 style={standardStyles.elementalMargin}>{t('subHeading')}</H4>
                <Text style={fonts.p}>{t('introduction')}</Text>
              </View>
            </AnimatedView>
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
    paddingBottom: '100%',
  },
  title: {
    fontSize: 72,
    lineHeight: 80,
  },
})
