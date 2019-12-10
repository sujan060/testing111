import * as React from 'react'
import { findNodeHandle, View } from 'react-native'

interface Section {
  id: string
  children: React.ReactNode
  onVisible: (param: any) => void
  param: any
}

interface Props {
  sections: Section[]
  threashold: number[]
}

interface State {
  id: string
}
export default class Observer extends React.PureComponent<Props, State> {
  state: State = {
    id: '',
  }

  observer: IntersectionObserver

  sectionRefs = this.props.sections.reduce((acc, section) => {
    acc[section.id] = React.createRef<View>()
    return acc
  }, {})

  ratios: Record<string, { id: string; ratio: number; top: number }> = {}

  componentDidMount = () => {
    this.createSectionObservers()
  }

  componentWillUnmount = () => {
    this.observer.disconnect()
  }

  createSectionObservers = () => {
    if (!('IntersectionObserver' in window)) {
      return
    }
    this.observer = new IntersectionObserver(this.determineMostVisibleSection, {
      threshold: this.props.threashold,
    })

    Object.keys(this.sectionRefs).forEach((id) => {
      const value = this.sectionRefs[id]
      // findNodeHandle is typed to return a number but returns an Element
      const element = (findNodeHandle(value.current) as unknown) as Element
      this.observer.observe(element)
    })
  }

  determineMostVisibleSection = (entries: IntersectionObserverEntry[]) => {
    this.ratios = entries
      .map((entry) => ({
        id: entry.target.id,
        ratio: entry.intersectionRatio,
        top: entry.boundingClientRect.top,
      }))
      .reduce((acc, currentValue) => {
        acc[currentValue.id] = currentValue
        return acc
      }, this.ratios)

    const top = Object.keys(this.ratios)
      .map((key) => this.ratios[key])
      .reduce(
        (acc, current) => {
          if (current.ratio > acc.ratio) {
            return current
          }
          return acc
        },
        { ratio: 0, id: this.state.id }
      )

    if (this.state.id !== top.id) {
      this.setState({ id: top.id })
      const currentSection = this.props.sections.find(({ id }) => id === top.id)
      currentSection.onVisible(currentSection.param)
    }
  }

  render() {
    return (
      <>
        {this.props.sections.map(({ id, children }) => {
          return (
            <View key={id} nativeID={id} ref={this.sectionRefs[id]}>
              {children}
            </View>
          )
        })}
      </>
    )
  }
}
