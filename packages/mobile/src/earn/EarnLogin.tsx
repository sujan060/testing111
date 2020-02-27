import { RootState } from '@celo/mobile/src/redux/reducers'
import Button, { BtnTypes } from '@celo/react-components/components/Button'
import TextInput from '@celo/react-components/components/TextInput'
import colors from '@celo/react-components/styles/colors'
import fontStyles from '@celo/react-components/styles/fonts'
import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { showError } from 'src/alert/actions'
import componentWithAnalytics from 'src/analytics/wrapper'
import { ErrorMessages } from 'src/app/ErrorMessages'
import { setFigureEightAccount } from 'src/earn/actions'

interface StateProps {
  figureEightUserId: string | null
}

interface State {
  userId: string
  password: string
}

interface DispatchProps {
  setFigureEightAccount: typeof setFigureEightAccount
  showError: typeof showError
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    figureEightUserId: state.earn.figureEightUserId,
  }
}

type Props = DispatchProps & StateProps

class EarnLogin extends React.Component<Props, State> {
  state = {
    userId: this.props.figureEightUserId || '',
    password: '',
  }

  onChangeInput = (userId: string) => {
    this.setState({ userId })
  }

  onChangePasswordInput = (password: string) => {
    this.setState({ password })
  }

  getExpectedPassword = (username: string) => {
    // TODO(anna) if this is used in future pilots use different password system
    const password = username[5] + username.length + username[0] + username[2]
    return password
  }

  checkUsernameCharacters = (username: string) => {
    const invalidChar = username.includes('.') || username.includes(',') || username.includes(' ')
    if (invalidChar) {
      this.props.showError(ErrorMessages.INVALID_CHAR_IN_USERNAME)
      this.setState({ userId: '' })
      return false
    } else if (username === '') {
      this.props.showError(ErrorMessages.MISSING_CEARN_ID)
      return false
    }
    return true
  }

  validateUsernameAndPassword = () => {
    const username = this.state.userId
    if (this.checkUsernameCharacters(username)) {
      const expected = this.getExpectedPassword(username)
      if (expected === this.state.password) {
        return true
      } else {
        this.props.showError(ErrorMessages.INVALID_CEARN_PASSWORD)
        this.setState({ password: '' })
        return false
      }
    } else {
      return false
    }
  }

  onSubmitUserId = () => {
    // Check that password is valid
    if (this.validateUsernameAndPassword()) {
      this.props.setFigureEightAccount(this.state.userId)
    }
  }

  render() {
    return (
      <View style={style.scrollView}>
        <Text style={fontStyles.body}>
          Log in to start earning. If you do not have a login, please ask for one.{' '}
        </Text>
        <TextInput
          onChangeText={this.onChangeInput}
          value={this.state.userId}
          style={style.inputField}
          placeholder="User ID"
        />
        <TextInput
          onChangeText={this.onChangePasswordInput}
          value={this.state.password}
          style={style.inputField}
          placeholder="Password"
        />
        <Button
          text={'Submit'}
          onPress={this.onSubmitUserId}
          standard={false}
          type={BtnTypes.PRIMARY}
          style={style.button}
        />
      </View>
    )
  }
}

export default componentWithAnalytics(
  connect<any, DispatchProps, {}, RootState>(mapStateToProps, {
    setFigureEightAccount,
    showError,
  })(EarnLogin)
)

const style = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  inputField: {
    // marginTop: 25,
    alignItems: 'center',
    borderColor: colors.inputBorder,
    borderRadius: 3,
    borderWidth: 1,
    marginVertical: 5,
    paddingLeft: 10,
    color: colors.inactive,
    height: 50,
  },
  button: { marginTop: 20, borderRadius: 3 },
})
