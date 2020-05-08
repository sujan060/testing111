import * as React from 'react'
import { useInView } from 'react-intersection-observer'
import { Image, StyleSheet, View } from 'react-native'
import { animated, config, useChain, useSpring } from 'react-spring'
import CambioLogo from 'src/cambio/CambioLogo'
import FlowerLines from 'src/cambio/Hibiscus/06-full-lines.png'
import FlowerFull from 'src/cambio/Hibiscus/full-green.png'
import { colors, getFade } from 'src/cambio/standards'

const THREASHOLD = [0, 0.5, 0.9]

export default function Cover() {
  const [refForDarkGreen, darkGreenInView] = useInView({ threshold: THREASHOLD })
  const [refForLineWork, lineWorkInView] = useInView({ threshold: THREASHOLD })

  const greenRef = React.useRef()
  const wireRef = React.useRef()

  const fullFlower = useSpring({ opacity: darkGreenInView ? 1 : 0, config: config.slow })
  const backdrop = useSpring({
    opacity: darkGreenInView ? 1 : 0,
    backgroundColor: colors.pine,
    top: 0,
    left: 0,
    zIndex: -1,
    position: 'absolute' as 'absolute',
    width: '100vw',
    height: '100vh',
    config: config.slow,
    ref: greenRef,
  })
  const linework = useSpring({
    opacity: lineWorkInView ? (darkGreenInView ? 0.8 : 1) : 0,
    config: config.slow,
    ref: wireRef,
    zIndex: -5,
    position: 'absolute' as 'absolute',
  })

  useChain([greenRef, wireRef])

  const logoHidden = !(darkGreenInView || lineWorkInView)

  return (
    <View>
      <View style={styles.root}>
        <View style={[styles.logo, logoHidden ? fade.hide : fade.show]}>
          <CambioLogo backgroundColor={colors.clear} forgroundColor={colors.forest} />
        </View>
        <div>
          <animated.div style={linework}>
            <Image style={styles.image} source={FlowerLines} />
          </animated.div>
          <animated.div style={backdrop} />
          <animated.div style={fullFlower}>
            <Image style={styles.image} source={FlowerFull} />
          </animated.div>
        </div>
      </View>
      <div ref={refForLineWork} style={{ width: '100%', height: '120vh', marginBottom: '100vh' }}>
        <div ref={refForDarkGreen} style={{ width: '100%', height: '40vh' }} />
      </div>
    </View>
  )
}

const fade = getFade('800ms')

const styles = StyleSheet.create({
  root: {
    flexDirection: 'column' as 'column',
    position: 'fixed' as 'fixed',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: { width: 500, height: 500, maxWidth: '85vw', maxHeight: '85vw' },
  logo: { position: 'absolute', zIndex: 20, top: 15, left: 15 },
})
