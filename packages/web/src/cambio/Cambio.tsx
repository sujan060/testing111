import { View } from 'react-native'
import ogImage from 'src/cambio/cambio-og.jpg'
import Cover from 'src/cambio/Cover'
import Creed from 'src/cambio/Creed'
import Footer from 'src/cambio/Footer'
import Incarnation from 'src/cambio/Incarnation'
import Intro from 'src/cambio/Intro'
import Myth from 'src/cambio/Myth'
import OpenGraph from 'src/header/OpenGraph'
import Invitation from './Invitation'
import Video from './Video'

// TODO: make sure text is always selectable / what you see on screen you can interact with as normal, also no FLASH of Content BOOO

export default function Cambio() {
  return (
    <View>
      <OpenGraph title="Câmbio" description="The Sacred Gift" path="/cambio" image={ogImage} />
      <View>
        <Cover />
        <Intro />
        <Video />
        <Myth />
        <Creed />
        <Incarnation />
        <Invitation />
        <Footer />
      </View>
    </View>
  )
}
