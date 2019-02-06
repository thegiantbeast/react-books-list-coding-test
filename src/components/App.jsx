import React, {Component} from 'react'
import i18n from '../translations.json'
import Loader from './Loader'
import ListView from './ListView'

export default class App extends Component {
    abortController = new AbortController()

    state = {
        isLoaded: false,
        data: null
    }

    async componentWillMount() {
        const blob = await fetch('/books_list.json', { signal: this.abortController.signal })
        this.setState({ isLoaded: true, data: await blob.json() })
    }

    componentWillUnmount() {
        this.abortController.abort()
    }

    render() {
        return [
            <Loader key={0} i18n={i18n} isLoaded={this.state.isLoaded} />,
            <ListView key={2} i18n={i18n} {...this.state} />
        ]
    }
}