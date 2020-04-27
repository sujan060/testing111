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
  const [ref, inView] = useInView()
  return (
    <>
      {' '}
      <View style={[styles.root, inView && styles.visible]}>
        <ImageBackground source={source} resizeMode="cover" style={styles.canvas}>
          <div style={gradient}>
            <GridRow allStyle={align === 'right' ? styles.right : styles.content}>
              <Cell span={Spans.half}>{children}</Cell>
            </GridRow>
          </div>
        </ImageBackground>
      </View>
      <div ref={ref} style={{ height: '75vh', marginTop: '25vh', marginBottom: '25vh' }} />
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
  },
  visible: {
    opacity: 1,
  },
  right: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  content: {
    alignItems: 'center',
  },
})

const gradient = {
  display: 'flex',
  background: `linear-gradient(90deg, ${colors.dark} 2%, rgba(46,51,56,0) 50%, ${colors.dark} 98%)`,
  height: '100vh',
}
