import * as React from 'react'
import { useSpring, animated, config, useChain } from 'react-spring'
import { useInView } from 'react-intersection-observer'
import FlowerLines from 'src/cambio/flower-linework.png'
import FlowerFull from 'src/cambio/flower-full.png'

export default React.memo(function Cover() {
  const [ref, inView] = useInView({ threshold: 0 })
  const [ref2, inView2] = useInView({ threshold: 0 })
  const fullFlower = useSpring({ opacity: inView ? 1 : 0, config: config.slow })
  const backdrop = useSpring({
    opacity: inView ? 1 : 0,
    backgroundColor: '#13603C',
    top: 0,
    left: 0,
    zIndex: -1,
    position: 'fixed' as 'fixed',
    width: '100vw',
    height: '100vh',
    config: config.slow,
  })
  const cambio = useSpring({
    color: '#0A4028',
    opacity: inView2 ? 1 : 0,
    transform: inView2 ? 'scale(2)' : 'scale(1)',
    textAlign: 'center',
    textTransform: 'uppercase',
    config: config.slow,
  })
  const linework = useSpring({ opacity: inView ? 0 : 1, config: config.slow })
  return (
    <>
      <div style={root}>
        <div style={flowerPosition}>
          <animated.div style={linework}>
            <img style={{ position: 'absolute', ...imageStyle }} src={FlowerLines} />
          </animated.div>
          <animated.div style={backdrop} />
          <animated.div style={fullFlower}>
            <img style={imageStyle} src={FlowerFull} />
          </animated.div>
        </div>
        <animated.h1
          // @ts-ignore
          style={cambio}
        >
          Câmbio
        </animated.h1>
      </div>

      <div ref={ref2} style={{ height: '30vh' }} />
      <div ref={ref} style={{ height: '50vh' }} />
      <div style={{ height: '40vh' }} />
    </>
  )
})

const root = {
  flexDirection: 'column' as 'column',
  position: 'fixed' as 'fixed',
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

const flowerPosition = {}

const imageStyle = { width: 400, height: 400 }
