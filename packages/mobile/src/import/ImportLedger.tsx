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
}

interface DispatchProps {
  importBackupPhrase: typeof importBackupPhrase
  hideAlert: typeof hideAlert
  importLedger: typeof importLedger
}

interface StateProps {
  isImportingWallet: boolean
}

type Props = StateProps & DispatchProps & WithTranslation & NavigationInjectedProps

const mapStateToProps = (state: RootState): StateProps => {
  return {
    isImportingWallet: state.imports.isImportingWallet,
  }
}

export class ImportLedger extends React.Component<Props, State> {
  static navigationOptions = nuxNavigationOptions

  state: State = {
    address: null,
    appVersion: null,
  }

  onPressGetAddress = async () => {
    const devices = await TransportHID.list()
    if (devices.length < 1) {
      throw new Error(
        'No device found - try unlocking if it is connected and starting the Celo app'
      )
    }

    const transport = await TransportHID.create()
    const eth = new Eth(transport)
    const config = await eth.getAppConfiguration()
    this.setState({ appVersion: config.version })

    const { address } = await eth.getAddress("44'/52752'/0'/0/0")
    this.setState({ address })
  }

  confirmAddress = () => {
    if (this.state.address) {
      this.props.importLedger(this.state.address)
    }
  }

  render() {
    const { t, isImportingWallet } = this.props
    const { appVersion, address } = this.state

    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="always"
        >
          <BackupKeyIcon style={styles.logo} width={140} height={102} />
          <Text style={fontStyles.h1}>{'Use a Ledger'}</Text>
          <Text style={fontStyles.h1}>{`App Version: ${appVersion}`}</Text>
          <Text style={fontStyles.h1}>{`Address: ${address}`}</Text>
        </KeyboardAwareScrollView>

        {isImportingWallet && (
          <View style={styles.loadingSpinnerContainer} testID="ImportWalletLoadingCircle">
            <ActivityIndicator size="large" color={colors.celoGreen} />
          </View>
        )}

        <Button
          disabled={isImportingWallet}
          onPress={address ? this.confirmAddress : this.onPressGetAddress}
          text={address ? 'Use this address' : 'Get your Ledger Address'}
          standard={false}
          type={BtnTypes.PRIMARY}
          testID="ImportWalletSocialButton"
        />
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
  },
  tip: {
    ...fontStyles.bodySmall,
    color: colors.darkSecondary,
    marginTop: 20,
    marginHorizontal: 2,
  },
  loadingSpinnerContainer: {
    marginVertical: 20,
  },
})

export default connect<StateProps, DispatchProps, any, RootState>(mapStateToProps, {
  importBackupPhrase,
  hideAlert,
  importLedger,
})(withTranslation(Namespaces.nuxRestoreWallet3)(ImportLedger))
