import * as React from 'react'
import { useInView } from 'react-intersection-observer'
import { ImageBackground, ImageRequireSource, StyleSheet, View } from 'react-native'
import { Cell, GridRow, Spans } from 'src/layout/GridRow'
import { colors } from 'src/styles'

interface Props {
  source: ImageRequireSource
  children: React.ReactNode
  align: 'left' | 'right'
}

export default function Magazine({ source, children, align }: Props) {
  const [ref, inView] = useInView({ threshold: 0.2 })
  return (
    <>
      <div ref={ref}>
        <View style={{ minHeight: '100vh', zIndex: 100, marginVertical: '5vh' }}>
          <GridRow desktopStyle={align === 'right' ? styles.right : styles.left}>
            <Cell span={Spans.half} style={[styles.content, inView && styles.contentVisible]}>
              {children}
            </Cell>
          </GridRow>
        </View>
      </div>
      <View style={[styles.root, inView && styles.visible]}>
        <ImageBackground source={source} resizeMode="cover" style={styles.canvas}>
          <div style={gradient} />
        </ImageBackground>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  canvas: {
    width: '100vw',
    height: '100vh',
  },
  root: {
    position: 'fixed',
    opacity: 0,
    transitionProperty: 'opacity',
    transitionDuration: '500ms',
    zIndex: 0,
  },
  visible: {
    opacity: 1,
    zIndex: 10,
  },
  contentVisible: {
    opacity: 1,
  },
  content: {
    opacity: 0,
    transitionProperty: 'opacity',
    transitionDuration: '1000ms',
  },
  right: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 15,
  },
  left: {
    alignItems: 'center',
    zIndex: 15,
  },
})

const gradient = {
  display: 'flex',
  justifyContent: 'center',
  background: `linear-gradient(90deg, ${colors.dark} 2%, rgba(46,51,56,0) 50%, ${colors.dark} 98%)`,
  height: '100vh',
  width: '100%',
}
