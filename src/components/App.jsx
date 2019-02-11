import React, {Component} from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import i18n from '../translations.json'
import Loader from './Loader'
import ListView from './ListView'

export default class App extends Component {
    abortController = new AbortController()

    state = {
        isLoaded: false,
        genreList: [],
        data: null,
        filterData: null,
        filterOpts: {}
    }

    async componentWillMount() {
        const blob = await fetch('/books_list.json', { signal: this.abortController.signal })
        const data = await blob.json()

        const genres = []

        // add column for the default sorting + fill all genres
        // note: avods having the original copy of the array in case of 'none' sort
        for(let i = 0; i < data.length; i++) {
            data[i].default_order = i
            genres.push(data[i].genre)
        }

        // use just the unique values from genres array
        const genreList = [...new Set(genres.sort())]

        this.setState({ isLoaded: true, data, genreList })
    }

    componentWillUnmount() {
        this.abortController.abort()
    }

    sortFn = (arr, prop) => {
        prop = prop.split('.')
        const len = prop.length

        arr.sort((a, b) => {
            let i = 0
            while (i < len) {
                a = a[prop[i]]
                b = b[prop[i]]
                i++
            }

            if (a < b) {
                return -1
            } else if (a > b) {
                return 1
            } else {
                return 0
            }
        })

        return arr
    }

    sortBy = (option) => {
        let fieldName = null
        switch (option) {
            case 'book-title':
                fieldName = 'title'
                break
            case 'author-name':
                fieldName = 'author.name'
                break
            default:
                fieldName = 'default_order'
        }

        // schedule the sorting for a later stage in order to
        // give the browser time to close the panel and appear to be more
        // responsive to the user eyes
        setTimeout(() => {
            this.setState({ data: this.sortFn(this.state.data, fieldName) })
        }, 100)
    }

    filterFn = (arr, prop, value) => {
        prop = prop.split('.')
        const len = prop.length

        return arr.filter((item) => {
            let i = 0
            while (i < len) {
                item = item[prop[i]]
                i++
            }

            return item === value
        })
    }

    filterBy = (field, value) => {
        let filterData = null
        let filterOpts = this.state.filterOpts
        let tempData = this.state.data

        if (value === "none") {
            delete filterOpts[field]
        } else {
            filterOpts[field] = value
        }

        filterData = (Object.keys(filterOpts).map((field) => {
            return tempData = this.filterFn(tempData, field, filterOpts[field])
        })).pop()

        this.setState({ filterData: filterData, filterOpts })
    }

    render() {
        return (
            <React.Fragment>
                <CssBaseline />
                <Loader i18n={i18n} isLoaded={this.state.isLoaded} />
                {this.state.isLoaded ? (<ListView i18n={i18n} sortBy={this.sortBy} filterBy={this.filterBy} filterData={this.state.filterData} {...this.state} />) : null}
            </React.Fragment>
        )
    }
}
