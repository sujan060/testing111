import colors from '@celo/react-components/styles/colors'
import { fontStyles } from '@celo/react-components/styles/fonts'
import BigNumber from 'bignumber.js'
import * as React from 'react'
import { withNamespaces, WithNamespaces } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import componentWithAnalytics from 'src/analytics/wrapper'
import { fetchExchangeRate } from 'src/exchange/actions'
import { CURRENCY_ENUM as Token } from 'src/geth/consts'
import { Namespaces } from 'src/i18n'
import { navigate } from 'src/navigator/NavigationService'
import { Screens } from 'src/navigator/Screens'
import { RootState } from 'src/redux/reducers'
import { getRateForMakerToken } from 'src/utils/currencyExchange'

interface StateProps {
  exchangeRate: BigNumber
}

interface DispatchProps {
  fetchExchangeRate: typeof fetchExchangeRate
}

type Props = StateProps & DispatchProps & WithNamespaces

const mapStateToProps = (state: RootState): StateProps => ({
  exchangeRate: getRateForMakerToken(state.exchange.exchangeRatePair, Token.DOLLAR),
})

export class ExchangeHomeScreen extends React.Component<Props> {
  static navigationOptions = {
    title: 'Exchange Home',
  }

  navigateHome = () => {
    navigate(Screens.WalletHome)
  }

  render() {
    return (
      <View style={style.body}>
        <View style={style.container}>
          <Text style={[fontStyles.bodySecondary]}>Cannot send on merchant app.</Text>
          <Button
            onPress={this.navigateHome}
            text={'Go Back Home'}
            // standard={false}
            // type={BtnTypes.PRIMARY}
            testID="RestartButton"
          />
        </View>
      </View>
    )
  }
}

export default componentWithAnalytics(
  connect<StateProps, DispatchProps, {}, RootState>(
    mapStateToProps,
    {
      fetchExchangeRate,
    }
  )(withNamespaces(Namespaces.exchangeFlow9)(ExchangeHomeScreen))
)

const style = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    marginBottom: 20,
    height: 60,
    width: 60,
  },
})
