import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Observer from 'src/layout/Oberver'
import { colors, fonts, standardStyles, textStyles } from 'src/styles'

interface State {
  backgroundColor: colors
}

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vel quam elementum pulvinar etiam non quam lacus. Duis tristique sollicitudin nibh sit amet commodo nulla facilisi nullam. Eget duis at tellus at urna condimentum. Nam libero justo laoreet sit. Id aliquet risus feugiat in ante metus. Consequat ac felis donec et. Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at augue. At tempor commodo ullamcorper a lacus vestibulum. Cras sed felis eget velit aliquet sagittis id consectetur. Mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus. Ligula ullamcorper malesuada proin libero nunc consequat. Magna fringilla urna porttitor rhoncus dolor purus non enim. Lacus sed turpis tincidunt id. Ut enim blandit volutpat maecenas volutpat blandit aliquam etiam erat. Consectetur purus ut faucibus pulvinar elementum. Suspendisse interdum consectetur libero id faucibus. Viverra ipsum nunc aliquet bibendum enim facilisis gravida neque convallis.

Dolor sed viverra ipsum nunc aliquet bibendum enim. Sed turpis tincidunt id aliquet risus. Ac auctor augue mauris augue neque gravida in. Pretium lectus quam id leo. Nisl condimentum id venenatis a condimentum vitae sapien. Iaculis at erat pellentesque adipiscing commodo. A diam sollicitudin tempor id eu nisl. Dui nunc mattis enim ut tellus. Mauris pellentesque pulvinar pellentesque habitant morbi. Donec ac odio tempor orci dapibus ultrices in iaculis. Nisi lacus sed viverra tellus. Ac tortor dignissim convallis aenean et tortor.

Amet volutpat consequat mauris nunc congue nisi vitae suscipit tellus. Auctor neque vitae tempus quam pellentesque nec nam aliquam sem. Tristique nulla aliquet enim tortor at auctor urna. Cursus sit amet dictum sit amet justo. Ac odio tempor orci dapibus ultrices in iaculis nunc sed. Massa placerat duis ultricies lacus sed turpis. Nulla facilisi nullam vehicula ipsum a arcu. Interdum posuere lorem ipsum dolor sit amet consectetur. Pulvinar neque laoreet suspendisse interdum consectetur libero id faucibus. Consequat nisl vel pretium lectus quam id. Maecenas ultricies mi eget mauris pharetra. Enim nunc faucibus a pellentesque sit amet porttitor. Aliquam eleifend mi in nulla posuere. Amet dictum sit amet justo donec enim diam. In est ante in nibh. Iaculis nunc sed augue lacus viverra vitae.

Nec ullamcorper sit amet risus nullam eget felis eget. Pellentesque diam volutpat commodo sed egestas egestas. Hac habitasse platea dictumst vestibulum. Aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc sed. Diam donec adipiscing tristique risus nec. Convallis convallis tellus id interdum velit laoreet id donec ultrices. In nisl nisi scelerisque eu. Et sollicitudin ac orci phasellus egestas tellus rutrum. Est ante in nibh mauris. Tristique senectus et netus et. Lacus luctus accumsan tortor posuere ac ut consequat. In est ante in nibh. Venenatis urna cursus eget nunc scelerisque viverra. Mi sit amet mauris commodo. Nulla aliquet porttitor lacus luctus accumsan tortor posuere ac ut.

Pharetra pharetra massa massa ultricies mi quis. Sit amet venenatis urna cursus. Rhoncus urna neque viverra justo nec. Laoreet id donec ultrices tincidunt arcu. Vulputate enim nulla aliquet porttitor lacus. Scelerisque eleifend donec pretium vulputate sapien nec sagittis aliquam malesuada. Facilisi nullam vehicula ipsum a arcu cursus vitae. Tincidunt praesent semper feugiat nibh sed pulvinar proin gravida. Consequat id porta nibh venenatis cras sed felis. Ac odio tempor orci dapibus. Nec ultrices dui sapien eget mi proin sed libero. Nec tincidunt praesent semper feugiat nibh sed pulvinar. Mauris sit amet massa vitae. Nunc sed velit dignissim sodales ut eu. Ante in nibh mauris cursus. Adipiscing elit ut aliquam purus sit amet luctus venenatis. Nibh tortor id aliquet lectus proin nibh nisl condimentum. Nullam non nisi est sit amet facilisis.`

export default class Rainbow extends React.PureComponent<{}, State> {
  state = {
    backgroundColor: colors.white,
  }

  setBackgroundColor = (color: colors) => {
    this.setState({ backgroundColor: color })
  }

  render() {
    return (
      // @ts-ignore
      <View style={[styles.shimmer, { backgroundColor: this.state.backgroundColor }]}>
        <Observer
          threashold={[0.1, 0.5, 0.9]}
          sections={[
            {
              children: (
                <View
                  style={[standardStyles.centered, { marginVertical: '100px', width: '100vw' }]}
                >
                  <Text style={fonts.h2}>{lorem}</Text>
                </View>
              ),
              onVisible: this.setBackgroundColor,
              id: 'test1',
              param: colors.faintGray,
            },
            {
              children: (
                <View
                  style={[standardStyles.centered, { marginVertical: '200px', width: '100vw' }]}
                >
                  <Text style={fonts.h3}>{lorem}</Text>
                </View>
              ),
              onVisible: this.setBackgroundColor,
              id: 'test2',
              param: colors.faintGold,
            },
            {
              children: (
                <View
                  style={[standardStyles.centered, { marginVertical: '300px', width: '100vw' }]}
                >
                  <Text style={fonts.h2}>{lorem}</Text>
                </View>
              ),
              onVisible: this.setBackgroundColor,
              id: 'test4',
              param: colors.faintCyan,
            },
            {
              children: (
                <View style={[standardStyles.centered, { marginVertical: '40px', width: '100vw' }]}>
                  <Text style={fonts.h2}>{lorem}</Text>
                </View>
              ),
              onVisible: this.setBackgroundColor,
              id: 'test4',
              param: colors.faintPurple,
            },
            {
              children: (
                <View style={[standardStyles.centered, { marginVertical: '90px', width: '100vw' }]}>
                  <Text style={fonts.h2}>{lorem}</Text>
                </View>
              ),
              onVisible: this.setBackgroundColor,
              id: 'test1',
              param: colors.light,
            },
            {
              children: (
                <View
                  style={[standardStyles.centered, { marginVertical: '100px', width: '100vw' }]}
                >
                  <Text style={[fonts.h2, textStyles.invert]}>{lorem}</Text>
                </View>
              ),
              onVisible: this.setBackgroundColor,
              id: 'test3',
              param: colors.dark,
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
