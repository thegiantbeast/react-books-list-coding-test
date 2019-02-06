import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Brightness2Icon from '@material-ui/icons/Brightness2'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'

const styles = theme => ({
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default
        },
    },
    moon: {
        transform: 'rotate(180deg)'
    }
})

class ListRow extends Component {
    lastFridayDates = []

    state = {
        dateTimeFormat: new Intl.DateTimeFormat(this.props.i18n.dateTimeFormat),
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

    render() {
        let icon = null

        const { classes, height, item } = this.props
        const date = new Date(item.publish_date * 1000)
        const dateFormatted = this.state.dateTimeFormat.format(date)

        // display a moon icon if genre is horror and is halloween day
        if (item.genre === 'Horror' && date.getDate() === 31 && date.getMonth() === 9) {
            icon = <Brightness2Icon className={classes.moon} />
        }

        // display dollar icon if genre is finance and is last friday of the month
        // note: to avoid wasting time recalculating dates, an array of pre-calculated dates is checked beforehand
        const lastFridayIndex = this.lastFridayDates.indexOf(dateFormatted)
        if (item.genre === 'Finance' && (lastFridayIndex >= 0 || this.isLastFridayOfMonth(date))) {
            icon = <AttachMoneyIcon />
            if (lastFridayIndex < 0) {
                this.lastFridayDates.push(dateFormatted)
            }
        }

        return (
            <TableRow className={classes.row} style={{ height }}>
                <TableCell>{icon}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.author.name}</TableCell>
                <TableCell>{item.author.gender}</TableCell>
                <TableCell>{item.genre}</TableCell>
                <TableCell>{dateFormatted}</TableCell>
            </TableRow>
        )
    }
}

export default withStyles(styles)(ListRow)