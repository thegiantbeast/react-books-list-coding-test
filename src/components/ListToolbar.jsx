import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import ListSort from './ListSort'
import ListFilter from './ListFilter'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
    root: {
        justifyContent: 'space-between',
        minWidth: 920 - 24 * 2 // min-width - padding-left - padding-right
    },
    actions: {
        color: theme.palette.text.secondary
    }
})

class ListToolbar extends Component {
    render() {
        const { classes, i18n, sortBy, filterBy, genreList } = this.props

        return (
            <Toolbar className={classes.root}>
                <Typography variant="h6">
                    {i18n.appTitle}
                </Typography>
                <div className={classes.actions}>
                    <ListSort i18n={i18n} sortBy={sortBy} />
                    <ListFilter i18n={i18n} filterBy={filterBy} genreList={genreList} />
                </div>
            </Toolbar>
        )
    }
}

export default withStyles(styles)(ListToolbar)


