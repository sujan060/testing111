import Head from 'next/head'
import Cover from 'src/cambio/Cover'

export default function Cambio() {
  return (
    <div style={{ height: '300vh' }}>
      <Head>
        <title>Câmbio</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Cover />
    </div>
  )
}
