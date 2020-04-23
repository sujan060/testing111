import Head from 'next/head'
import Cover from 'src/cambio/Cover'

export default function Cambio() {
  return (
    <div style={{ height: '300vh' }}>
      <Head>
        <title>Câmbio</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ position: 'relative' }}>
        <Cover />
        {/* <div style={{backgroundColor: colors.faintRed, height: '40vh'}} />
        <div style={{backgroundColor: colors.faintGold, height: '30vh'}} />
        <div style={{backgroundColor: colors.faintPurple, height: '50vh'}} /> */}
      </div>
    </div>
  )
}
