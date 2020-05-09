import * as React from 'react'
import { useInView } from 'react-intersection-observer'
import { Image, StyleSheet, Text, View } from 'react-native'
import frames from 'src/cambio/incarnation-frames/index'
import { Cell, GridRow, Spans } from 'src/layout/GridRow'
import { fonts, standardStyles, textStyles } from 'src/styles'
import { getFade } from './standards'
// import AspectRatio from 'src/shared/AspectRatio'

function getCamera(_, two, three, four, five, six, seven) {
  if (seven) {
    return styles.camera7
  } else if (six) {
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
  const [ref7, showStack7] = useInView()
  const cameraPosition = getCamera(
    showStack1,
    showStack2,
    showStack3,
    showStack4,
    showStack5,
    showStack6,
    showStack7
  )

  const isFrame2 =
    showStack2 && !(showStack3 || showStack4 || showStack5 || showStack6 || showStack7)
  const isFrame3 = showStack3 && !(showStack4 || showStack5 || showStack6 || showStack7)
  const isFrame4 = showStack4 && !(showStack5 || showStack6 || showStack7)
  const isFrame5 = showStack5 && !(showStack6 || showStack7)
  const isFrame6 = showStack6 && !showStack7
  const isFrame7 = showStack7
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
              <Image
                style={[styles.frame, showStack7 && styles.visible]}
                source={frames.seven}
                resizeMode="contain"
              />
            </View>
            <View style={[standardStyles.elementalMarginTop, { alignItems: 'center' }]}>
              <Text style={[fonts.p, styles.caption, isFrame2 ? fades.show : fades.hide]}>
                <Text style={textStyles.heavy}>Money</Text>, backed by underutilized resources. —
                Natural capital backed currencies
              </Text>

              <Text style={[fonts.p, styles.caption, isFrame3 ? fades.show : fades.hide]}>
                <Text style={textStyles.heavy}>Money</Text>, independently issued as a complement
                alongside federal currency. — Local currencies, backed by local goods
              </Text>
              <Text style={[fonts.p, styles.caption, isFrame4 ? fades.show : fades.hide]}>
                <Text style={textStyles.heavy}>Money</Text> that can reduce our system’s structural
                dependence on debt. — Time banks, Mutual credit, Demurrage-charged currencies
              </Text>
              <Text style={[fonts.p, styles.caption, isFrame5 ? fades.show : fades.hide]}>
                <Text style={textStyles.heavy}>Money</Text>, gifted into existence — through a basic
                income
              </Text>
              <Text style={[fonts.p, styles.caption, isFrame6 ? fades.show : fades.hide]}>
                <Text style={textStyles.heavy}>Money</Text>, earned into being.
              </Text>
              <Text style={[fonts.p, styles.caption, isFrame7 ? fades.show : fades.hide]}>
                — like a good deed for a bus token.
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
                <div ref={ref6} style={referenceStyle}>
                  <div ref={ref7} style={referenceStyle} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const fades = getFade('400ms')

const referenceStyle = { paddingTop: '101vh', width: 100, marginTop: '25vh' }

const styles = StyleSheet.create({
  root: {
    position: 'fixed',
    alignItems: 'center',
    top: 50,
    left: 0,
    width: '100vw',
    height: '100vh',
  },
  container: {
    marginTop: 50,
    width: 300,
    height: 300,
    maxWidth: '90vw',
    maxHeight: '90vw',
    alignSelf: 'center',
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
    transform: [{ scale: 2.25 }, { translateY: 50 }],
  },
  camera4: {
    transform: [{ scale: 2 }, { translateY: 50 }],
  },
  camera5: {
    transform: [{ scale: 0.9 }, { translateY: 0 }],
  },
  camera6: {
    transform: [{ scale: 1 }, { translateY: 0 }],
  },
  camera7: {
    transform: [{ scale: 1.1 }, { translateY: 0 }],
  },
  caption: {
    position: 'absolute',
    textAlign: 'center',
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
})
