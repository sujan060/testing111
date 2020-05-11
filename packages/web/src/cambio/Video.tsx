import * as React from 'react'
import { InView } from 'react-intersection-observer'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import YouTube from 'react-youtube'
import { Cell, GridRow, Spans } from 'src/layout/GridRow'
import { fonts, standardStyles, textStyles } from 'src/styles'
import { colors, getFade } from './standards'
// import coverImage from 'src/cambio/Hibiscus/full-green.png'
import PlayCircle from 'src/shared/PlayCircle'

const opts = {
  // height: this.playerHeight(),
  width: '100%',
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 0,
    controls: 1,
    playsinline: 1,
    modestbranding: 1,
  },
}

export default function Video() {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [isPressing, setIsPressing] = React.useState(false)

  const videoRef = React.useRef()

  const onPlay = React.useCallback((event) => {
    event.target.setVolume(50)
    setIsPlaying(true)
  }, [])

  const onStop = React.useCallback(() => setIsPlaying(false), [])

  const onPressOut = React.useCallback(() => setIsPressing(false), [])
  const onPressIn = React.useCallback(() => setIsPressing(true), [])

  const onPressPlay = React.useCallback(() => {
    if (videoRef.current) {
      // @ts-ignore
      videoRef.current.playVideo()
    }
  }, [videoRef.current])

  const onViewChange = React.useCallback(
    (inView) => {
      if (!videoRef?.current) {
        return
      }

      if (inView) {
        // @ts-ignore
        // videoRef.current?.playVideo()
      } else {
        // @ts-ignore
        videoRef.current?.pauseVideo()
      }
    },
    [videoRef?.current]
  )

  function onPlayerReady(event) {
    videoRef.current = event.target
  }

  return (
    <>
      <View style={[styles.cinema, isPlaying ? fade.show : fade.hide]} />
      <InView onChange={onViewChange} threshold={0.5}>
        {({ ref, inView }) => (
          <View style={styles.root}>
            <GridRow allStyle={standardStyles.centered}>
              <Cell span={Spans.half}>
                <div ref={ref} style={{ position: 'relative' }}>
                  <TouchableOpacity
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    style={[
                      standardStyles.centered,
                      styles.pressable,
                      isPlaying ? fade.hide : fade.show,
                    ]}
                    onPress={onPressPlay}
                  >
                    <View style={isPressing && styles.isPressing}>
                      <PlayCircle outline={colors.forest} background={colors.dew} />
                    </View>
                  </TouchableOpacity>
                  <YouTube
                    videoId={'eusVhYgm6sI'}
                    opts={opts}
                    onReady={onPlayerReady}
                    onPlay={onPlay}
                    onPause={onStop}
                    onEnd={onStop}
                    onError={onStop}
                  />
                </div>
                <Text
                  style={[
                    fonts.p,
                    standardStyles.elementalMargin,
                    isPlaying || !inView ? fade.hide : fade.show,
                  ]}
                >
                  <Text style={textStyles.heavy}>April 22, 2020</Text> Sep Kamvar telling stories of
                  the Curitiba Bus Token, video courtesy of Blockchain for Social Impact Coalition
                </Text>
              </Cell>
            </GridRow>
          </View>
        )}
      </InView>
    </>
  )
}

const styles = StyleSheet.create({
  root: {
    zIndex: 20,
    marginBottom: '30vh',
  },
  cinema: {
    position: 'fixed',
    height: '100vh',
    width: '100vw',
    backgroundColor: colors.darkest,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  pressable: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderColor: colors.dew,
    backgroundColor: colors.lightest,
    borderWidth: 1,
  },
  isPressing: {
    transitionDuration: '200ms',
    transitionProperty: 'transform',
    transform: [{ scale: 0.85 }],
  },
})

const fade = getFade('600ms')
