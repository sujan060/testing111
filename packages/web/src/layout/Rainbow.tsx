import * as React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import Observer from 'src/layout/Oberver'
import { colors, standardStyles, fonts, textStyles } from 'src/styles'

interface State {
  backgroundColor: colors
}

export default class Rainbow extends React.PureComponent<{}, State> {
  state = {
    backgroundColor: colors.white,
  }

  setBackgroundColor = (color: colors) => {
    this.setState({ backgroundColor: color })
  }

  render() {
    return (
      <View style={[styles.shimmer, { backgroundColor: this.state.backgroundColor }]}>
        <Observer
          threashold={[0.1, 0.5, 0.9]}
          sections={[
            {
              children: (
                <View style={[standardStyles.centered, { height: '90vh', width: '100vw' }]}>
                  <Text style={fonts.h2}>Hey</Text>
                </View>
              ),
              onVisible: this.setBackgroundColor,
              id: 'test1',
              param: colors.faintGray,
            },
            {
              children: (
                <View style={[standardStyles.centered, { height: '50vh', width: '100vw' }]}>
                  <Text style={fonts.h2}>You</Text>
                </View>
              ),
              onVisible: this.setBackgroundColor,
              id: 'test2',
              param: colors.faintCyan,
            },
            {
              children: (
                <View style={[standardStyles.centered, { height: '100vh', width: '100vw' }]}>
                  <Text style={[fonts.h2, textStyles.invert]}>Yes</Text>
                </View>
              ),
              onVisible: this.setBackgroundColor,
              id: 'test3',
              param: colors.dark,
            },
            {
              children: (
                <View style={[standardStyles.centered, { height: '90vh', width: '100vw' }]}>
                  <Text style={fonts.h2}>You</Text>
                </View>
              ),
              onVisible: this.setBackgroundColor,
              id: 'test4',
              param: colors.faintGold,
            },
          ]}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  shimmer: { transitionProperty: 'background-color', transitionDuration: '500ms' },
})
