import * as React from 'react'
import { useInView } from 'react-intersection-observer'
import { StyleSheet, Text, View } from 'react-native'
import { Cell, GridRow, Spans } from 'src/layout/GridRow'
import { fonts, standardStyles, textStyles } from 'src/styles'
import YouTube from 'react-youtube'
import { colors } from './standards'

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

// function onReady(x) {

// }

export default function Video() {
  const [isPlaying, setIsPlaying] = React.useState(false)

  const onPlay = React.useCallback(() => setIsPlaying(true), [])

  const onStop = React.useCallback(() => setIsPlaying(false), [])

  const [ref] = useInView()

  return (
    <View style={isPlaying && { backgroundColor: colors.darkest, zIndex: 1000 }}>
      <GridRow allStyle={standardStyles.centered} mobileStyle={styles.root}>
        <Cell span={Spans.half}>
          <Text style={fonts.p}>
            <div ref={ref}>
              <YouTube
                videoId={'eusVhYgm6sI'}
                opts={opts}
                // onReady={onReady}
                onPlay={onPlay}
                onPause={onStop}
                onEnd={onStop}
                onError={onStop}
              />
            </div>
            <Text style={[textStyles.heavy, standardStyles.elementalMargin]}>April 22, 2020</Text>{' '}
            Sep Kamvar telling stories of the Curitiba Bus Token, video courtesy of Blockchain for
            Social Impact Coalition
          </Text>
        </Cell>
      </GridRow>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    paddingBottom: '50vh',
    zIndex: 100,
  },
})
