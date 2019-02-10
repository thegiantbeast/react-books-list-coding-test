import React, { Component } from 'react'
// import { withStyles } from '@material-ui/core/styles'
import ListToolbar from './ListToolbar'
import ListTable from './ListTable'
import ListRow from './ListRow'

export default class ListView extends Component {
    state = {
        data: null,
        filterData: null,
        filterOpts: {},
        genreList: [],
        clientHeight: 0,
        scrollTop: 0,
        toolbarHeight: 64,
        tableMinWidth: 1024,
        rowHeight: 30 // browser limitation
    }

    componentWillMount() {
        const genres = []

        // add column for the default sorting + fill all genres
        // note: avods having the original copy of the array in case of 'none' sort
        for(let i = 0; i < this.props.data.length; i++) {
            this.props.data.default_order = i
            genres.push(this.props.data[i].genre)
        }

        // use just the unique values from genres array
        const genreList = [...new Set(genres)]

        this.setState({ data: this.props.data, genreList })

        
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleWindowResize)
        this.refs.container.addEventListener('scroll', this.handleNodeScroll)

        // now that we have the element reference,
        // lets get the `this.refs.container` height
        this.handleWindowResize()
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize)
        this.refs.container.removeEventListener('scroll', this.handleNodeScroll)
    }

    handleWindowResize = () => {
        this.setState({ clientHeight: this.refs.container.clientHeight })
    }

    handleNodeScroll = () => {
        this.setState({ scrollTop: this.refs.container.scrollTop * 2 })

        this.refs.container.children[0].children[0].style.top = `${this.refs.container.scrollTop}px`
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

        this.refs.container.scrollTo(0, 0)
    }

    render() {
        const { i18n } = this.props
        const {
            clientHeight,
            scrollTop,
            rowHeight,
            toolbarHeight,
            tableMinWidth,
            data,
            filterData,
            genreList
        } = this.state

        const tableHeaderHeight = 56

        const dataset = (filterData ? filterData : data)

        const currentIndex = Math.floor(scrollTop / rowHeight)
        const startIndex = Math.max(0, currentIndex)
        const endIndex = Math.max(0, Math.min(dataset.length, currentIndex + Math.ceil((clientHeight) / rowHeight)))

        const contentHeight = ((rowHeight * (dataset.length + 1)) / 2) + tableHeaderHeight * 15

        const rows = dataset.slice(startIndex, endIndex).map((item, idx) => {
            return <ListRow key={idx} i18n={i18n} item={item} height={rowHeight} />
        })

        return (
            <React.Fragment>
                <ListToolbar key={0} i18n={i18n} sortBy={this.sortBy} filterBy={this.filterBy} genreList={genreList} height={toolbarHeight} tableMinWidth={tableMinWidth} />
                <div key={1} ref="container" style={{ height: `calc(100vh - ${toolbarHeight}px)`, overflowY: 'scroll' }}>
                    <div style={{ height: contentHeight, position: 'relative' }}>
                        <ListTable i18n={i18n} minWidth={tableMinWidth}>
                            {rows}
                        </ListTable>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
