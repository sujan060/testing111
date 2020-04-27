import * as React from 'react'
import { useInView } from 'react-intersection-observer'
import { Image, StyleSheet, View } from 'react-native'
import frames from 'src/cambio/incarnation-frames/index'

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
  const [ref1, showFrame1] = useInView()
  const [ref2, showFrame2] = useInView()
  const [ref3, showFrame3] = useInView()
  const [ref4, showFrame4] = useInView()
  const [ref5, showFrame5] = useInView()
  const [ref6, showFrame6] = useInView()
  const cameraPosition = getCamera(
    showFrame1,
    showFrame2,
    showFrame3,
    showFrame4,
    showFrame5,
    showFrame6
  )
  return (
    <>
      <View style={styles.root}>
        <View style={[styles.container, cameraPosition]}>
          <Image
            style={[styles.frame, showFrame1 && styles.visible]}
            source={frames.first}
            resizeMode="contain"
          />
          <Image
            style={[styles.frame, showFrame2 && styles.visible]}
            source={frames.second}
            resizeMode="contain"
          />
          <Image
            style={[styles.frame, showFrame3 && styles.visible]}
            source={frames.third}
            resizeMode="contain"
          />
          <Image
            style={[styles.frame, showFrame4 && styles.visible]}
            source={frames.fourth}
            resizeMode="contain"
          />
          <Image
            style={[styles.frame, showFrame5 && styles.visible]}
            source={frames.fifth}
            resizeMode="contain"
          />
          <Image
            style={[styles.frame, showFrame6 && styles.visible]}
            source={frames.sixth}
            resizeMode="contain"
          />
        </View>
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
    width: 500,
    height: 500,
    transitionProperty: 'transform',
    transitionDuration: '0.75s',
    // @ts-ignore
    willChange: 'transform',
    transformOrigin: 'center',
    perspective: 100,
  },
  camera1: {
    transform: [{ scale: 2.25 }, { translateY: 150 }],
  },
  camera2: {
    transform: [{ scale: 2 }, { translateY: 150 }],
  },
  camera3: {
    transform: [{ scale: 2 }, { translateY: 150 }],
  },
  camera4: {
    transform: [{ scale: 1.5 }, { translateY: 0 }],
  },
  camera5: {
    transform: [{ scale: 1 }, { translateY: 0 }],
  },
  camera6: {
    transform: [{ scale: 1 }, { translateY: 0 }],
  },
  frame: {
    transitionDuration: '1s',
    transitionProperty: 'opacity',
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
})
