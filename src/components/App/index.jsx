import React, {Component} from 'react'
import Loader from '../Loader'
import ListView from '../ListView'

const i18n = {
    loading: 'Loading...',
    list: {
        title: 'Book Title',
        authorName: 'Author Name',
        authorGender: 'Author Gender',
        genre: 'Genre',
        publishDate: 'Publish Date'
    }
}

export default class App extends Component {
    state = {
        isLoaded: false,
        data: null
    }
    async componentDidMount() {
        const json = await fetch('/books_list.json')
        this.setState({ isLoaded: true, data: await json.json() })
    }

    render() {
        return [
            <Loader key={0} i18n={i18n} isLoaded={this.state.isLoaded} />,
            //<Form key={1} />,
            <ListView key={2} i18n={i18n} {...this.state} />
        ]
    }
}