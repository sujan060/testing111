import SmartTopAlert, { NotificationTypes } from '@celo/react-components/components/SmartTopAlert'
import * as React from 'react'
import { WithTranslation, withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { clearError } from 'src/app/actions'
import { errorMessages } from 'src/app/reducer'
import { RootState } from 'src/redux/reducers'

interface StateProps {
  error: errorMessages | null
  errorInfo: object | undefined
  dismissErrorAfter: number | null
}

interface DispatchProps {
  clearError: typeof clearError
}

type Props = StateProps & WithTranslation & DispatchProps

const mapStateToProps = (state: RootState): StateProps => {
  return {
    error: state.app.error,
    info: state.app.errorInfo,
    dismissErrorAfter: state.app.dismissErrorAfter,
  }
}

const mapDispatchToProps = {
  clearError,
}

export class ErrorBox extends React.Component<Props> {
  render() {
    const { t, info, error, dismissErrorAfter, clearError: clearErrorAction } = this.props

    return (
      <SmartTopAlert
        timestamp={Date.now()}
        text={error && t(error, info)}
        onPress={clearErrorAction}
        type={NotificationTypes.ERROR}
        dismissAfter={dismissErrorAfter}
      />
    )
  }
}

export default connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation('global')(ErrorBox))
