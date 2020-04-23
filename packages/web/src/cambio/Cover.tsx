import * as React from 'react'
import { useSpring, animated, useChain, config } from 'react-spring'
import { useInView } from 'react-intersection-observer'
import FlowerLines from 'src/cambio/flower-linework.png'
import FlowerFull from 'src/cambio/flower-full.png'

const THREASHOLD = [0, 0.5, 1]

export default React.memo(function Cover() {
  const [ref, inView] = useInView({ threshold: THREASHOLD })
  const [ref2, inView2] = useInView({ threshold: THREASHOLD })

  const greenRef = React.useRef()
  const wireRef = React.useRef()

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
    ref: greenRef,
  })
  const cambio = useSpring({
    color: '#0A4028',
    opacity: inView2 ? 1 : 0,
    transform: inView2 ? 'scale(2)' : 'scale(1)',
    textAlign: 'center',
    textTransform: 'uppercase',
    config: config.slow,
  })
  const linework = useSpring({
    opacity: inView ? 0.8 : 1,
    config: config.slow,
    ref: wireRef,
    zIndex: -5,
    position: 'absolute' as 'absolute',
    onRest: (x) => {
      console.log(x)
    },
  })

  useChain([greenRef, wireRef])

  return (
    <>
      <div style={root}>
        <div>
          <animated.div style={linework}>
            <img style={imageStyle} src={FlowerLines} />
          </animated.div>
          <animated.div style={backdrop} />
          <animated.div style={fullFlower}>
            <img style={imageStyle} src={FlowerFull} />
          </animated.div>
          <animated.h1
            // @ts-ignore
            style={cambio}
          >
            Câmbio
          </animated.h1>
        </div>
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

const imageStyle = { width: 400, height: 400 }
