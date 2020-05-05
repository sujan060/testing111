import * as React from 'react'
import { Text } from 'react-native'
import Bridge from 'src/cambio/myth/01.jpg'
import Guy from 'src/cambio/myth/02.jpg'
import Truck from 'src/cambio/myth/03.jpg'
import { H2 } from 'src/fonts/Fonts'
import { fonts, textStyles } from 'src/styles'
import Magazine from './Magazine'

export default function Myth() {
  return (
    <>
      <Magazine source={Bridge} align="left">
        <>
          <H2 style={textStyles.invert}>The Myth</H2>
          <Text style={[fonts.p, textStyles.invert]}>
            <Text style={{ marginBottom: '100vh' }}>
              In the 1970s in the Brazilian city of Curitiba, there was, as there is in many
              impoverished parts of the globe, too much garbage.
            </Text>
            The roads that went through the favelas were not wide enough for garbage trucks to go
            through, and the garbage accumulated on the streets, in the river, in the fields on the
            outskirts of the favelas.
          </Text>
        </>
      </Magazine>
      <Magazine source={Guy} align="right">
        <Text style={[fonts.p, textStyles.invert]}>
          At the same time, there were rapid developments in the local bus system, that created
          excess capacity on the buses. The local government decided to start paying people with bus
          tokens to clean up garbage. One pound of garbage collected would be rewarded a bus token.
          The garbage pickers just needed to weigh the garbage that they picked --
          proof-of-collection, if you will -- and they would receive their tokens.
        </Text>
      </Magazine>
      <Magazine source={Truck} align="left">
        <Text style={[fonts.p, textStyles.invert]}>
          The bus tokens were used to take the bus downtown to find work. But they also circulated
          as money in the favelas. They were, in effect, a new currency, with many properties that I
          see as the future of currencies: they were earned into existence, backed by underutilized
          resources, issued independently alongside the federal currency, and they reduced our
          monetary system’s structural dependence on debt. I can imagine many currencies like this.
        </Text>
      </Magazine>
    </>
  )
}
