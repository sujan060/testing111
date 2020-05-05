import { H2 } from 'src/fonts/Fonts'
import { Cell, GridRow, Spans } from 'src/layout/GridRow'
import { fonts, standardStyles, colors } from 'src/styles'
import { Text } from 'react-native'

export default function Creed() {
  return (
    <GridRow
      allStyle={[standardStyles.centered, { backgroundColor: colors.white, minHeight: '100vh' }]}
    >
      <Cell span={Spans.half} tabletSpan={Spans.twoThird}>
        <H2 style={[standardStyles.elementalMarginBottom]}>Innovating on Money</H2>
        <Text style={fonts.p}>
          We believe that money can be beautiful — and to do so means innovating on money by
          shifting our common notions of prosperity. We are beckoned towards these notions with
          human rights. A fundamental step of prosperity is ensuring basic needs are met and that
          all people have resources like food, water, healthcare, shelter, and energy needed to
          fulfill their human rights. We shape these notions with human ingenuity. The features of
          money have a considerable impact on society, and through our ingenuity we can now amplify
          this design space for a more prosperous future of currencies.
        </Text>
      </Cell>
    </GridRow>
  )
}
