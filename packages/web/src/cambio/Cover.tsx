import * as React from 'react'
import { useInView } from 'react-intersection-observer'
import { Image, StyleSheet, View } from 'react-native'
import CambioLogo from 'src/cambio/CambioLogo'
import FlowerLines from 'src/cambio/Hibiscus/06-full-lines.png'
import FlowerFull from 'src/cambio/Hibiscus/full-green.png'
import { colors, getFade } from 'src/cambio/standards'

const THREASHOLD = [0, 0.5, 0.9]

export default function Cover() {
  const [refForDarkGreen, darkGreenInView] = useInView({ threshold: THREASHOLD })
  const [refForLineWork, lineWorkInView] = useInView({ threshold: THREASHOLD })

  const logoHidden = !(darkGreenInView || lineWorkInView)

  return (
    <View>
      <View style={styles.root}>
        <View style={[styles.logo, logoHidden ? styles.invisible : styles.visible]}>
          <CambioLogo backgroundColor={colors.clear} forgroundColor={colors.forest} />
        </View>
        <div>
          <View
            style={[styles.linework, { opacity: lineWorkInView ? (darkGreenInView ? 0.8 : 1) : 0 }]}
          >
            <Image style={styles.image} source={FlowerLines} />
          </View>
          <View style={[styles.backdrop, darkGreenInView ? styles.visible : styles.invisible]} />
          <View style={darkGreenInView ? fade.show : fade.hide}>
            <Image style={styles.image} source={FlowerFull} />
          </View>
        </div>
      </View>
      <div ref={refForLineWork} style={{ height: '120vh', marginBottom: '60vh' }}>
        <div ref={refForDarkGreen} style={{ height: '40vh' }} />
      </div>
    </View>
  )
}

const fade = getFade('400ms')

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
  backdrop: {
    backgroundColor: colors.pine,
    top: 0,
    left: 0,
    zIndex: -1,
    position: 'absolute' as 'absolute',
    width: '100vw',
    height: '100vh',
  },
  linework: {
    zIndex: -5,
    position: 'absolute',
    transitionDuration: '500ms',
    transitionProperty: 'opacity',
  },
  visible: {
    opacity: 1,
    transitionDuration: '400ms',
    transitionProperty: 'opacity',
  },
  invisible: {
    opacity: 0,
    transitionDuration: '400ms',
    transitionProperty: 'opacity',
  },
  image: { width: 500, height: 500, maxWidth: '85vw', maxHeight: '85vw' },
  logo: { position: 'absolute', zIndex: 20, top: 15, left: 15 },
})
