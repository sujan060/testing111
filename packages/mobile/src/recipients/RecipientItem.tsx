import ContactCircle from '@celo/react-components/components/ContactCircle'
import colors from '@celo/react-components/styles/colors'
import { fontStyles } from '@celo/react-components/styles/fonts'
import { mapToFakeNumber } from '@celo/utils/src/phoneNumbers'
import React, { useCallback } from 'react'
import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { getPrivateDemoEnabled } from 'src/app/selectors'
import { unknownUserIcon } from 'src/images/Images'
import { getRecipientThumbnail, Recipient, RecipientKind } from 'src/recipients/recipient'
import useSelector from 'src/redux/useSelector'

interface Props {
  recipient: Recipient
  onSelectRecipient(recipient: Recipient): void
}

export default function RecipientItem({ recipient, onSelectRecipient }: Props) {
  const onPress = useCallback(() => {
    onSelectRecipient(recipient)
  }, [recipient, onSelectRecipient])

  const isPrivateDemoEnabled = useSelector(getPrivateDemoEnabled)
  const displayValue =
    isPrivateDemoEnabled &&
    (recipient.kind === RecipientKind.Contact || recipient.kind === RecipientKind.MobileNumber)
      ? mapToFakeNumber(recipient.e164PhoneNumber || recipient.displayId || 'unknown')
      : recipient.displayId

  return (
    <TouchableHighlight onPress={onPress} underlayColor={colors.altDarkBg}>
      <View style={style.row}>
        <ContactCircle
          style={style.avatar}
          name={recipient.displayName}
          thumbnailPath={getRecipientThumbnail(recipient)}
          address={recipient.address}
          size={40}
        >
          <Image source={unknownUserIcon} style={style.image} />
        </ContactCircle>
        <View style={style.nameContainer}>
          <Text
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={[fontStyles.bodySmallSemiBold, style.name]}
          >
            {recipient.displayName}
          </Text>
        </View>
        <Text style={[fontStyles.bodySmallSemiBold, fontStyles.light, style.phone]}>
          {displayValue}
        </Text>
      </View>
    </TouchableHighlight>
  )
}

const style = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    paddingHorizontal: 10,
    flex: 1,
  },
  avatar: {
    marginRight: 10,
  },
  nameContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingRight: 5,
  },
  name: {
    lineHeight: 41,
  },
  invite: {
    color: colors.celoGreen,
    lineHeight: 41,
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
  image: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phone: {
    textAlign: 'right',
    lineHeight: 41,
  },
})
