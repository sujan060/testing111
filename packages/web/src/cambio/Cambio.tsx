import Head from 'next/head'
import Cover from 'src/cambio/Cover'
import { View } from 'react-native'
import Curitiba from 'src/cambio/Curitiba'
import OpenGraph from 'src/header/OpenGraph'

export default function Cambio() {
  return (
    <View style={{ height: '300vh' }}>
      <OpenGraph title="Câmbio" description="The Sacred Gift" path="/cambio" image="/TODO" />
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <View style={{ position: 'relative' }}>
        <Cover />
        <Curitiba />
      </View>
    </View>
  )
}
