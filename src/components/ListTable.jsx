import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'

const styles = theme => ({
    root: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    iconColumn: {
        padding: 0
    }
})

class ListTable extends Component {
    render() {
        const { classes, minWidth, i18n, children } = this.props

        return (
            <Table className={classes.root} style={{ minWidth }}>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.iconColumn}>{/* Indication Icon */}</TableCell>
                        <TableCell>{i18n.list.title}</TableCell>
                        <TableCell>{i18n.list.authorName}</TableCell>
                        <TableCell>{i18n.list.authorGender}</TableCell>
                        <TableCell>{i18n.list.genre}</TableCell>
                        <TableCell>{i18n.list.publishDate}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {children}
                </TableBody>
            </Table>
        )
    }
}

export default withStyles(styles)(ListTable)
