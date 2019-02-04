import React, {Component} from 'react'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
})

class ListTable extends Component {
    render() {
        const { classes, i18n, children } = this.props

        return (
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell>{/* Indication Icon */}</TableCell>
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