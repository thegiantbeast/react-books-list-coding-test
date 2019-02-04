import React, {Component} from 'react'
import i18n from '../translations.json'
import Loader from './Loader'
import ListView from './ListView'

export default class App extends Component {
    state = {
        isLoaded: false,
        data: null
    }
    async componentWillMount() {
        const blob = await fetch('/books_list.json')
        this.setState({ isLoaded: true, data: await blob.json() })
    }

    render() {
        return [
            <Loader key={0} i18n={i18n} isLoaded={this.state.isLoaded} />,
            <ListView key={2} i18n={i18n} {...this.state} />
        ]
    }
}