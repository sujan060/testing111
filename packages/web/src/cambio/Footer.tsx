import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { colors } from 'src/cambio/standards'
import { Cell, GridRow, Spans } from 'src/layout/GridRow'
import { useScreenSize } from 'src/layout/ScreenSize'
import RingsGlyph from 'src/logos/RingsGlyph'
import ChangeStory from 'src/shared/ChangeStory'
import { Copyright } from 'src/shared/Copyright'
import { socialMenu } from 'src/shared/SocialMenu'
import { fonts } from 'src/styles'
import Button, { BTN } from 'src/shared/Button.3'

export default function Footer() {
  const { isMobile } = useScreenSize()
  return (
    <GridRow>
      <Cell span={Spans.full}>
        <View>
          <Text style={styles.heading}>
            <RingsGlyph color={colors.forest} />
            {isMobile}
            <Text style={[fonts.legal, styles.headingText]}>
              Imagined With{' '}
              <Button
                target="_blank"
                kind={BTN.INLINE}
                text={'Celo'}
                href={'/'}
                style={styles.icon}
              />
            </Text>
          </Text>
          <Social />
        </View>
        <View style={styles.copyChange}>
          <Copyright style={styles.copyright} />
          <ChangeStory color={colors.pine} />
        </View>
      </Cell>
    </GridRow>
  )
}

function Social() {
  return (
    <View style={styles.icons}>
      {socialMenu(colors.pine, 20).map(({ icon, link, name }) => (
        <Button
          key={name}
          target="_blank"
          iconLeft={icon}
          kind={BTN.INLINE}
          text={''}
          href={link}
          style={styles.icon}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  heading: {
    textAlign: 'center',
    marginBottom: 20,
  },
  headingText: {
    marginLeft: 12,
    color: colors.forest,
  },
  copyright: {
    color: colors.forest,
    marginBottom: 20,
  },
  icons: {
    marginVertical: 20,
    flexDirection: 'row',
    maxWidth: 350,
    justifyContent: 'space-between',
  },
  icon: {
    textDecorationColor: colors.pine,
  },
  copyChange: {},
})
