import * as React from 'react'
import { useInView } from 'react-intersection-observer'
import { animated, config, useChain, useSpring } from 'react-spring'
import FlowerLines from 'src/cambio/Hibiscus/06-full-lines.png'
import FlowerFull from 'src/cambio/Hibiscus/full-green.png'

const THREASHOLD = [0, 0.5, 0.9]

export default React.memo(function Cover() {
  const [refForDarkGreen, darkGreenInView] = useInView({ threshold: THREASHOLD })
  const [refForLineWork, lineWorkInView] = useInView({ threshold: THREASHOLD })

  const greenRef = React.useRef()
  const wireRef = React.useRef()

  const fullFlower = useSpring({ opacity: darkGreenInView ? 1 : 0, config: config.slow })
  const backdrop = useSpring({
    opacity: darkGreenInView ? 1 : 0,
    backgroundColor: '#13603C',
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

  return (
    <div>
      <div style={root}>
        <div>
          <animated.div style={linework}>
            <img style={imageStyle} src={FlowerLines} />
          </animated.div>
          <animated.div style={backdrop} />
          <animated.div style={fullFlower}>
            <img style={imageStyle} src={FlowerFull} />
          </animated.div>
        </div>
      </div>
      <div ref={refForLineWork} style={{ width: '100%', height: '120vh', marginBottom: '100vh' }}>
        <div ref={refForDarkGreen} style={{ width: '100%', height: '40vh' }} />
      </div>
    </div>
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

const imageStyle = { width: 500, height: 500, maxWidth: '85vw', maxHeight: '85vw' }
