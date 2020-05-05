import * as React from 'react'
import { useInView } from 'react-intersection-observer'
import { Image, StyleSheet, Text, View } from 'react-native'
import frames from 'src/cambio/incarnation-frames/index'
import { Cell, GridRow, Spans } from 'src/layout/GridRow'
import { fonts, standardStyles } from 'src/styles'
// import AspectRatio from 'src/shared/AspectRatio'

function getCamera(_, two, three, four, five, six) {
  if (six) {
    return styles.camera6
  } else if (five) {
    return styles.camera5
  } else if (four) {
    return styles.camera4
  } else if (three) {
    return styles.camera3
  } else if (two) {
    return styles.camera2
  }
  return styles.camera1
}

export default function Incarnation() {
  const [ref1, showStack1] = useInView()
  const [ref2, showStack2] = useInView()
  const [ref3, showStack3] = useInView()
  const [ref4, showStack4] = useInView()
  const [ref5, showStack5] = useInView()
  const [ref6, showStack6] = useInView()
  const cameraPosition = getCamera(
    showStack1,
    showStack2,
    showStack3,
    showStack4,
    showStack5,
    showStack6
  )

  // const isFrame1 = showStack1 && !(showStack2 || showStack3 || showStack4 || showStack5 || showStack6)
  const isFrame2 = showStack2 && !(showStack3 || showStack4 || showStack5 || showStack6)
  const isFrame3 = showStack3 && !(showStack4 || showStack5 || showStack6)
  const isFrame4 = showStack4 && !(showStack5 || showStack6)
  const isFrame5 = showStack5 && !showStack6
  // const isFrame6 = showStack6
  return (
    <>
      <View style={styles.root}>
        <GridRow allStyle={standardStyles.centered}>
          <Cell span={Spans.half} tabletSpan={Spans.twoThird}>
            <View style={[styles.container, cameraPosition]}>
              <Image
                style={[styles.frame, showStack1 && styles.visible]}
                source={frames.first}
                resizeMode="contain"
              />
              <Image
                style={[styles.frame, showStack2 && styles.visible]}
                source={frames.second}
                resizeMode="contain"
              />
              <Image
                style={[styles.frame, showStack3 && styles.visible]}
                source={frames.third}
                resizeMode="contain"
              />
              <Image
                style={[styles.frame, showStack4 && styles.visible]}
                source={frames.fourth}
                resizeMode="contain"
              />
              <Image
                style={[styles.frame, showStack5 && styles.visible]}
                source={frames.fifth}
                resizeMode="contain"
              />
              <Image
                style={[styles.frame, showStack6 && styles.visible]}
                source={frames.sixth}
                resizeMode="contain"
              />
            </View>
            <View style={standardStyles.elementalMarginTop}>
              <Text
                style={[
                  fonts.p,
                  { position: 'absolute' },
                  isFrame2 ? styles.visible : styles.invisible,
                ]}
              >
                Our means of payment are, by and large, loaned into existence, national in nature,
                fractional reserve backed, and established by fiat.
              </Text>
              <Text
                style={[
                  fonts.p,
                  { position: 'absolute' },
                  isFrame3 ? styles.visible : styles.invisible,
                ]}
              >
                While this design has been and will continue to be useful for a large variety of
                transactions, it obscures a vast design space, some of which has been explored on
                the margins, including:
              </Text>
              <Text
                style={[
                  fonts.p,
                  { position: 'absolute' },
                  isFrame4 ? styles.visible : styles.invisible,
                ]}
              >
                time banks, mutual credit, local currencies backed by local goods, demurrage-charged
                currencies, natural-capital backed currencies, money gifted into existence through a
                basic income, and others.
              </Text>
              <Text style={[fonts.p, isFrame5 ? styles.visible : styles.invisible]}>
                We believe that many of these features have great potential for positive impact, and
                that we would be well-served to have a world in which the way value is stored and
                transmitted is more an ecology than a monoculture.
              </Text>
            </View>
          </Cell>
        </GridRow>
      </View>
      <div ref={ref1} style={referenceStyle}>
        <div ref={ref2} style={referenceStyle}>
          <div ref={ref3} style={referenceStyle}>
            <div ref={ref4} style={referenceStyle}>
              <div ref={ref5} style={referenceStyle}>
                <div ref={ref6} style={referenceStyle} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const referenceStyle = { paddingTop: '101vh', width: 100, marginTop: '25vh' }

const styles = StyleSheet.create({
  root: {
    position: 'fixed',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
  },
  container: {
    marginTop: 50,
    width: 250,
    height: 250,
    alignSelf: 'center',
    justifyContent: 'center',
    transitionProperty: 'transform',
    transitionDuration: '0.75s',
    // @ts-ignore
    willChange: 'transform',
    transformOrigin: 'center',
    perspective: 10,
  },
  camera1: {
    transform: [{ scale: 2.25 }, { translateY: 50 }],
  },
  camera2: {
    transform: [{ scale: 2.25 }, { translateY: 50 }],
  },
  camera3: {
    transform: [{ scale: 1 }, { translateY: 50 }],
  },
  camera4: {
    transform: [{ scale: 1 }, { translateY: 0 }],
  },
  camera5: {
    transform: [{ scale: 1 }, { translateY: 0 }],
  },
  camera6: {
    transform: [{ scale: 1 }, { translateY: 0 }],
  },
  frame: {
    transitionDuration: '800ms',
    transitionProperty: 'opacity',
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
  },
  visible: {
    opacity: 1,
    zIndex: 10,
    transitionDuration: '400ms',
    transitionProperty: 'opacity',
  },
  invisible: {
    zIndex: 0,
    opacity: 0,
    transitionDuration: '400ms',
    transitionProperty: 'opacity',
  },
})
