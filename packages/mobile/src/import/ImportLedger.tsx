import Button, { BtnTypes } from '@celo/react-components/components/Button'
import KeyboardAwareScrollView from '@celo/react-components/components/KeyboardAwareScrollView'
import KeyboardSpacer from '@celo/react-components/components/KeyboardSpacer'
import colors from '@celo/react-components/styles/colors'
import { fontStyles } from '@celo/react-components/styles/fonts'
import Eth from '@ledgerhq/hw-app-eth'
import TransportHID from '@ledgerhq/react-native-hid'
import * as React from 'react'
import { WithTranslation } from 'react-i18next'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import { NavigationInjectedProps } from 'react-navigation'
import { connect } from 'react-redux'
import { hideAlert } from 'src/alert/actions'
import { Namespaces, withTranslation } from 'src/i18n'
import BackupKeyIcon from 'src/icons/BackupKeyIcon'
import { importBackupPhrase, importLedger } from 'src/import/actions'
import { nuxNavigationOptions } from 'src/navigator/Headers'
import { RootState } from 'src/redux/reducers'

interface State {
  address: string | null
  appVersion: string | null
  title: string
  error: string | null
  isFetching: boolean
}

interface DispatchProps {
  importBackupPhrase: typeof importBackupPhrase
  hideAlert: typeof hideAlert
  importLedger: typeof importLedger
}

type Props = DispatchProps & WithTranslation & NavigationInjectedProps

interface Step {
  header: string
  body: string
}

const steps: Step[] = [
  {
    header: 'Install the Celo Ledger app',
    body: 'Install and open the Celo Ledger app using Ledger Live',
  },
  {
    header: 'Connect and unlock your Ledger',
    body:
      'Connect to the Ledger by plugging it into your phone or connecting via Bluetooth. Use your Ledger PIN to unlock your Ledger.',
  },
  {
    header: 'Open the Celo app',
    body: 'You should see a message that says "Application is Ready"',
  },
]

export class ImportLedger extends React.Component<Props, State> {
  static navigationOptions = nuxNavigationOptions

  state: State = {
    address: null,
    appVersion: null,
    title: 'Connecting to Ledger',
    error: null,
    isFetching: false,
  }

  onPressGetAddress = async () => {
    if (this.state.address) {
      this.props.importLedger(this.state.address)
      return
    }

    this.setState({ error: null, isFetching: true })
    try {
      const devices = await TransportHID.list()
      if (devices.length < 1) {
        throw new Error('No devices found')
      }

      const transport = await TransportHID.create()
      const eth = new Eth(transport)
      const config = await eth.getAppConfiguration()
      const { address } = await eth.getAddress("44'/52752'/0'/0/0")
      this.setState({
        address,
        appVersion: config.version,
        title: 'Ledger Connected',
        isFetching: false,
      })
    } catch {
      this.setState({
        error: 'No Ledger device found. Ensure you have followed the directions above',
        isFetching: false,
      })
    }
  }

  cancel = () => {
    this.setState({
      address: null,
      appVersion: null,
      title: 'Connecting to Ledger',
    })
  }

  render() {
    const { appVersion, address, isFetching } = this.state

    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="always"
        >
          <BackupKeyIcon style={styles.logo} height={101} />
          <Text style={fontStyles.h1}>{this.state.title}</Text>
          {appVersion && (
            <View style={{ alignItems: 'center' }}>
              <Text style={fontStyles.bodySmallSemiBold}>
                {'Celo Ledger App Version'.toUpperCase()}
              </Text>
              <Text style={styles.appInfo}>{appVersion}</Text>
              <Text style={[fontStyles.bodySmallSemiBold, { marginTop: 15 }]}>
                {'Address'.toUpperCase()}
              </Text>
              <Text style={styles.appInfo}>{address}</Text>
            </View>
          )}
          {!appVersion && (
            <>
              <Text style={fontStyles.regular}>{'Follow these steps to connect:'}</Text>
              {steps.map((step, index) => {
                return (
                  <View style={styles.stepContainer} key={step.header}>
                    <View style={styles.stepNumber}>
                      <Text style={fontStyles.regular}>{`${index + 1}.`}</Text>
                    </View>
                    <View>
                      <Text style={fontStyles.headerTitle}>{step.header}</Text>
                      <Text style={fontStyles.regular}>{step.body}</Text>
                    </View>
                  </View>
                )
              })}
              {this.state.error && (
                <Text style={[fontStyles.regular, styles.error]}>{this.state.error}</Text>
              )}
            </>
          )}
        </KeyboardAwareScrollView>

        {isFetching && (
          <View style={styles.loadingSpinnerContainer} testID="ImportWalletLoadingCircle">
            <ActivityIndicator size="large" color={colors.celoGreen} />
          </View>
        )}

        <Button
          key={'textbutton'}
          onPress={this.onPressGetAddress}
          text={address ? 'Use this address' : 'Connect to Ledger'}
          standard={false}
          type={BtnTypes.PRIMARY}
          testID="ImportWalletSocialButton"
        />
        {address && (
          <Button
            onPress={this.cancel}
            text={'Cancel'}
            standard={false}
            type={BtnTypes.SECONDARY}
            testID="ImportWalletSocialButton"
          />
        )}
        <KeyboardSpacer />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 0,
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 20,
    marginLeft: 20,
  },
  loadingSpinnerContainer: {
    marginVertical: 20,
  },
  stepContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  stepNumber: {
    marginRight: 15,
  },
  error: {
    color: colors.errorRed,
    padding: 20,
  },
  appInfo: {
    fontSize: 16,
    ...fontStyles.light,
    color: colors.grayHeavy,
  },
})

export default connect<null, DispatchProps, any, RootState>(null, {
  importBackupPhrase,
  hideAlert,
  importLedger,
})(withTranslation(Namespaces.nuxRestoreWallet3)(ImportLedger))
