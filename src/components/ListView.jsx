import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import SortIcon from '@material-ui/icons/Sort'
import FilterListIcon from '@material-ui/icons/FilterList'
import Brightness2Icon from '@material-ui/icons/Brightness2'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
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
        dateTimeFormat: new Intl.DateTimeFormat(this.props.i18n.dateTimeFormat)
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
        if (!this.props.isLoaded) { // data is not ready yet...
            return null
        }

        const { classes, i18n, data } = this.props

        return <div>
            <Tooltip title={i18n.list.tooltips.sort}>
                <IconButton buttonRef={node => { this.sortEl = node }} aria-label={i18n.list.tooltips.sort}>
                    <SortIcon />
                </IconButton>
            </Tooltip>
            <Popper open={open} anchorEl={this.anchorEl} transition disablePortal>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        id="menu-list-grow"
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                    >
                        <Paper>
                        <ClickAwayListener onClickAway={this.handleClose}>
                            <MenuList>
                            <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                            <MenuItem onClick={this.handleClose}>My account</MenuItem>
                            <MenuItem onClick={this.handleClose}>Logout</MenuItem>
                            </MenuList>
                        </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
            <Tooltip title={i18n.list.tooltips.filter}>
                <IconButton buttonRef={node => { this.filterEl = node }} aria-label={i18n.list.tooltips.filter}>
                    <FilterListIcon />
                </IconButton>
            </Tooltip>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>{i18n.list.title}</TableCell>
                        <TableCell>{i18n.list.authorName}</TableCell>
                        <TableCell>{i18n.list.authorGender}</TableCell>
                        <TableCell>{i18n.list.genre}</TableCell>
                        <TableCell>{i18n.list.publishDate}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.slice(0, 10).map((row, idx) => {
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
                </TableBody>
            </Table>
        </div>
    }

}

export default withStyles(styles)(ListView)
