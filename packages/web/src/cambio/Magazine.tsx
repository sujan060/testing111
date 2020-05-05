import * as React from 'react'
import { useInView } from 'react-intersection-observer'
import { ImageBackground, ImageRequireSource, StyleSheet, View } from 'react-native'
import { Cell, GridRow, Spans } from 'src/layout/GridRow'
// import { colors } from 'src/styles'

interface Props {
  source: ImageRequireSource
  children: React.ReactNode
  align: 'left' | 'right'
}

export default function Magazine({ source, children, align }: Props) {
  const [ref, inView] = useInView({ threshold: 0.2 })
  return (
    <>
      <View style={[styles.root, inView && styles.visible]}>
        <ImageBackground
          source={source}
          resizeMode="contain"
          style={[styles.canvas, inView && styles.ken]}
        >
          <div style={gradient} />
        </ImageBackground>
      </View>
      <div ref={ref}>
        <View style={{ minHeight: '100vh', zIndex: 50 }}>
          <GridRow desktopStyle={align === 'right' ? styles.right : styles.left}>
            <Cell span={Spans.half} style={[styles.content, inView && styles.contentVisible]}>
              {children}
            </Cell>
          </GridRow>
        </View>
      </div>
    </>
  )
}

const styles = StyleSheet.create({
  canvas: {
    width: '100vw',
    height: '100vh',
    transitionDuration: '60s',
    transitionProperty: 'transform',
  },
  root: {
    position: 'fixed',
    opacity: 0,
    transitionProperty: 'opacity',
    transitionDuration: '1000ms',
    zIndex: 5,
    backgroundColor: '#000',
  },
  visible: {
    opacity: 1,
    zIndex: 10,
  },
  contentVisible: {
    opacity: 1,
  },
  content: {
    opacity: 0.5,
    transitionProperty: 'opacity',
    transitionDuration: '100ms',
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
  ken: {
    transform: [{ scale: 1.1 }],
  },
})

const gradient = {
  display: 'flex',
  justifyContent: 'center',
  // background: `linear-gradient(0deg, rgba(0,0,0,0.5) 2%, rgba(0,0,0,0) 50%, ${colors.dark} 98%)`,
  height: '100vh',
  width: '100%',
}
