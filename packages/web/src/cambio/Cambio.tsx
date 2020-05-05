import Head from 'next/head'
import { View } from 'react-native'
import Cover from 'src/cambio/Cover'
import Curitiba from 'src/cambio/Intro'
import Incarnation from 'src/cambio/Incarnation'
import OpenGraph from 'src/header/OpenGraph'
import Myth from './Myth'

export default function Cambio() {
  return (
    <View>
      <OpenGraph title="Câmbio" description="The Sacred Gift" path="/cambio" image="/TODO" />
      <Head>
        <link rel="icon" href="/cambio-favicon.ico" />
      </Head>
      <View>
        <Cover />
        <Curitiba />
        <Myth />
        <Incarnation />
      </View>
    </View>
  )
}
