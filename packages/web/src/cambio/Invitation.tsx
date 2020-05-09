import { GridRow, Cell, Spans } from 'src/layout/GridRow'
import { standardStyles, fonts } from 'src/styles'
import * as React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import frames from 'src/cambio/incarnation-frames/index'
import { H2 } from 'src/fonts/Fonts'
import CButton, { Kind } from 'src/cambio/CButton'

import { colors } from './standards'
import TwitterLogo from 'src/icons/TwitterLogo'

export default function Invitation() {
  return (
    <View style={styles.root}>
      <GridRow allStyle={standardStyles.centered}>
        <Cell span={Spans.half}>
          <Image style={styles.image} source={frames.seven} resizeMode="contain" />
          <H2 style={standardStyles.elementalMargin}>An Invitation</H2>
          <Text style={fonts.p}>
            This is a design space brought into living color through shifting notions of prosperity.
            These are shifts that are possible when we creatively work together — serving one
            another. The spirit of creating the conditions of prosperity for all. You’re invited.
            Come change the story.
          </Text>
          <View style={[standardStyles.centered, standardStyles.elementalMarginTop]}>
            <CButton
              style={styles.buttonMobile}
              children="Join the Celo Community"
              kind={Kind.dark}
              href={''}
            />
            <Text style={[fonts.h6, standardStyles.elementalMarginTop]}>Share</Text>
            <CButton style={styles.buttonMobile} kind={Kind.light} href={''}>
              <Text style={styles.twitter}>
                <TwitterLogo
                  height={15}
                  // @ts-ignore
                  color={colors.forest}
                />
              </Text>
              on Twitter
            </CButton>
            <CButton
              style={styles.buttonMobile}
              children="Copy site url"
              kind={Kind.light}
              href={''}
            />
          </View>
        </Cell>
      </GridRow>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { backgroundColor: colors.lightest, marginTop: '150vh', zIndex: -10 },
  image: {
    alignSelf: 'center',
    width: 267,
    height: 276,
  },
  twitter: {
    display: 'inline-flex',
    marginRight: 5,
    transform: [{ translateY: 1 }, { scale: 1.2 }],
  },
  buttonMobile: {
    width: 226,
  },
})
