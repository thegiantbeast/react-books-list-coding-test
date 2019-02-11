import React, { Component } from 'react'
// import { withStyles } from '@material-ui/core/styles'
import ListToolbar from './ListToolbar'
import ListTable from './ListTable'
import ListRow from './ListRow'

export default class ListView extends Component {
    state = {
        clientHeight: 0,
        scrollTop: 0,
        toolbarHeight: 64,
        tableMinWidth: 1024,
        rowHeight: 30 // browser limitation
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

    filterBy = (field, value) => {
        this.props.filterBy(field, value)

        // scroll user page back to the top
        this.refs.container.scrollTo(0, 0)
    }

    render() {
        const { i18n, genreList, data, filterData, sortBy } = this.props
        const {
            clientHeight,
            scrollTop,
            rowHeight,
            toolbarHeight,
            tableMinWidth
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
                <ListToolbar i18n={i18n} sortBy={sortBy} filterBy={this.filterBy} genreList={genreList} height={toolbarHeight} tableMinWidth={tableMinWidth} />
                <div ref="container" style={{ height: `calc(100vh - ${toolbarHeight}px)`, overflowY: 'scroll' }}>
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
