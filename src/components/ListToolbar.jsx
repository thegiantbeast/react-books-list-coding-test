import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import ListSort from './ListSort'
import ListFilter from './ListFilter'
import { Typography } from '@material-ui/core';

const styles = theme => ({
    root: {
        paddingRight: theme.spacing.unit,
    },
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        flex: '0 4 100%',
        color: theme.palette.text.secondary,
    },
    title: {
        flex: '0 0 auto',
    },
})

class ListToolbar extends Component {
    render() {
        const { classes, i18n, sortBy, filterBy } = this.props

        return (
            <Toolbar className={classes.root}>
                <div className={classes.title}>
                    <Typography variant="h6" id="tableTitle">
                        {i18n.appTitle}
                    </Typography>
                </div>
                <div className={classes.spacer} />
                <div className={classes.actions}>
                    <ListSort i18n={i18n} sortBy={sortBy} />
                    <ListFilter i18n={i18n} filterBy={filterBy} />
                </div>
            </Toolbar>
        )
    }
}

export default withStyles(styles)(ListToolbar)


