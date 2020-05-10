import { StyleSheet, Text } from 'react-native'
import { H2, H4 } from 'src/fonts/Fonts'
import { Cell, GridRow, Spans } from 'src/layout/GridRow'
import { fonts, standardStyles } from 'src/styles'

export default function Creed() {
  return (
    <GridRow allStyle={[standardStyles.centered, styles.root]}>
      <Cell span={Spans.half} tabletSpan={Spans.twoThird}>
        <H2 style={[standardStyles.elementalMarginBottom]}>Innovating on Money</H2>
        <H4 style={standardStyles.elementalMarginBottom}>
          A movement to energize our collective power
        </H4>
        <Text style={fonts.p}>
          We believe that money can be beautiful — and it means innovating on money, by shifting our
          common notions of prosperity. We’re beckoned toward these notions by human rights. A
          fundamental step within prosperity is ensuring basic needs are met, and that all people
          have resources like food, water, healthcare, shelter, and energy needed to fulfill their
          human rights. And we shape these notions with human ingenuity. The features of money have
          a considerable impact on society, and through our ingenuity we can now amplify this design
          space for a more prosperous future of currencies.
        </Text>
      </Cell>
    </GridRow>
  )
}

const styles = StyleSheet.create({
  root: {
    marginTop: '50vh',
    minHeight: '100vh',
  },
})
