import React, { Component } from 'react'
// import { withStyles } from '@material-ui/core/styles'
import ListToolbar from './ListToolbar'
import ListTable from './ListTable'
import ListRow from './ListRow'

export default class ListView extends Component {
    state = {
        data: null,
        genreList: [],
        clientHeight: 0,
        scrollTop: 0,
        toolbarHeight: 64,
        tableMinWidth: 920,
        rowHeight: 30 // 48 limitation
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleWindowResize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize)
        this.node.removeEventListener('scroll', this.handleNodeScroll)
    }

    handleWindowResize = (event) => {
        // console.log(`clientHeight: ${this.node.clientHeight}`)
        this.setState({ clientHeight: this.node.clientHeight })
    }

    handleNodeScroll = (event) => {
        // console.log(`scrollTop: ${this.node.scrollTop}`)
        this.setState({ scrollTop: this.node.scrollTop })

        this.node.children[0].style.paddingTop = `${this.node.scrollTop}px`
    }

    attachScrollListener = (node) => {
        if (node) {
            this.node = node
            this.node.addEventListener('scroll', this.handleNodeScroll)

            // now that we have the element, lets trigger the first resize call
            // in order to get the `this.node` height
            window.dispatchEvent(new Event('resize'))
        }
    }

    componentWillReceiveProps(props) {
        if (props.data) {
            const genres = []

            // add column for the default sorting + fill all genres
            // note: avods having the original copy of the array in case of 'none' sort
            for(let i = 0; i < props.data.length; i++) {
                props.data.default_order = i
                genres.push(props.data[i].genre)
            }

            // use just the unique values from genres array
            const genreList = [...new Set(genres)]

            this.setState({ data: props.data, genreList })
        }
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

    filterBy = (field, value) => {
        const data = this.state.data.filter((item) => {
            return item[field] === value
        })
        this.setState({ data })
    }

    render() {
        if (!this.props.isLoaded) { // data is not ready yet...
            return null
        }

        const { i18n } = this.props
        const { clientHeight, scrollTop, rowHeight, toolbarHeight, tableMinWidth, data, genreList } = this.state
        const MAX_RECORDS = 1000000

        const currentIndex = Math.floor(scrollTop / rowHeight)
        const startIndex = Math.max(0, currentIndex - 10)
        const startBuffer = currentIndex - startIndex
        const endIndex = Math.min(MAX_RECORDS, currentIndex + Math.ceil(clientHeight / rowHeight) + 10)

        const rows = data.slice(startIndex, endIndex).map((item, idx) => {
            return <ListRow key={idx} i18n={i18n} item={item} height={rowHeight} />
        })

        // const customStyle = { paddingTop: 150 } TODO: set table padding-top
        const s = {
            height: toolbarHeight
        }

        return [
            <ListToolbar key={0} i18n={i18n} sortBy={this.sortBy} filterBy={this.filterBy} genreList={genreList} height={toolbarHeight} tableMinWidth={tableMinWidth} />,
            <div key={1} ref={this.attachScrollListener} style={{ height: `calc(100vh - ${toolbarHeight}px)`, overflowY: 'scroll' }}>
                <div style={{ height: 33420600 }}>
                    <ListTable i18n={i18n} minWidth={tableMinWidth}>
                        {rows}
                    </ListTable>
                </div>
            </div>
        ]
    }

}
