import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Brightness2Icon from '@material-ui/icons/Brightness2'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'
import ListToolbar from './ListToolbar'
import ListTable from './ListTable'

const styles = theme => ({
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
    moon: {
        transform: 'rotate(180deg)'
    }
})

class ListView extends Component {
    lastFridayDates = []

    state = {
        originalData: null,
        data: null,
        genre: [],
        dateTimeFormat: new Intl.DateTimeFormat(this.props.i18n.dateTimeFormat)
    }

    componentWillReceiveProps(props) {
        if (props.data) {
            const genre = [...new Set(props.data.map(item => item.genre))]
            this.setState({ originalData: props.data, data: props.data, genre })
        }
    }

    isLastFridayOfMonth = (date) => {
        const lastDayMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        const fridayOffset = lastDayMonth.getDay() - 5

        if (fridayOffset < 0) {
            lastDayMonth.setDate(lastDayMonth.getDate() + (Math.abs(fridayOffset) - 7))
        } else {
            lastDayMonth.setDate(lastDayMonth.getDate() - fridayOffset)
        }

        return lastDayMonth.getDate() === date.getDate()
    }

    sortFn = (arr, prop) => {
        prop = prop.split('.')
        const len = prop.length
    
        arr.sort((a, b) => {
            let i = 0
            while( i < len ) {
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
        switch(option) {
            case 'book-title':
                fieldName = 'title'
                break
            case 'author-name':
                fieldName = 'author.name'
                break
            default:
                fieldName = 'default_order'
        }
        
        this.setState({ data: this.sortFn(this.state.data, fieldName) })
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
        const { data, genreList } = this.state

        return [
            <ListToolbar key={0} i18n={i18n} sortBy={this.sortBy} filterBy={this.filterBy} genreList={genreList} />,
            <ListTable key={1} i18n={i18n}>
                <ListItem i18n={i18n} data={data} />
            </ListTable>
        ]
    }

}
