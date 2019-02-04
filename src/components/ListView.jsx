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
        if (option === 'none') {
            this.setState({ data: this.state.originalData })
        } else {
            option = option === 'book-title' ? 'title' : 'author.name'
            this.setState({ data: this.sortFn(this.state.originalData, option) })
        }
    }

    filterBy = (field, value) => {
    }

    render() {
        if (!this.props.isLoaded) { // data is not ready yet...
            return null
        }

        const { classes, i18n } = this.props
        const { data, genre } = this.state

        return [
            <ListToolbar key={0} i18n={i18n} sortBy={this.sortBy} filterBy={this.filterBy} filterGenre={genre} />,
            <ListTable key={1} i18n={i18n}>
                {data.slice(0, 1000).map((row, idx) => {
                    let icon = null

                    const date = new Date(row.publish_date * 1000)
                    const dateFormatted = this.state.dateTimeFormat.format(date)

                    // display a moon icon if genre is horror and is halloween day
                    if (row.genre === 'Horror' && date.getDate() === 31 && date.getMonth() === 9) {
                        icon = <Brightness2Icon className={classes.moon} />
                    }

                    // display dollar icon if genre is finance and is last friday of the month
                    // note: to avoid wasting time recalculating dates, an array of pre-calculated dates is checked beforehand
                    const lastFridayIndex = this.lastFridayDates.indexOf(dateFormatted)
                    if (row.genre === 'Finance' && (lastFridayIndex >= 0 || this.isLastFridayOfMonth(date))) {
                        icon = <AttachMoneyIcon />
                        if (lastFridayIndex < 0) {
                            this.lastFridayDates.push(dateFormatted)
                        }
                    }

                    return (
                        <TableRow className={classes.row} key={idx}>
                            <TableCell>{icon}</TableCell>
                            <TableCell>{row.title}</TableCell>
                            <TableCell>{row.author.name}</TableCell>
                            <TableCell>{row.author.gender}</TableCell>
                            <TableCell>{row.genre}</TableCell>
                            <TableCell>{dateFormatted}</TableCell>
                        </TableRow>
                    )
                })}
            </ListTable>
        ]
    }

}

export default withStyles(styles)(ListView)
