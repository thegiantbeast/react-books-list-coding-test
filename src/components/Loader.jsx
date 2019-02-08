import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = theme => ({
    wrapper: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
    },
    progress: {
        margin: theme.spacing.unit * 2 + 'px 50%',
    },
})

function Loader(props) {
    const { classes, isLoaded } = props

    if (isLoaded) return null

    return (
        <div className={classes.wrapper} style={{ display: props.isLoaded ? 'none' : '' }} >
            <div className={classes.progress}>
                <CircularProgress disableShrink={true} />
                <div>{props.i18n.loading}</div>
            </div>
        </div>
    )
}

export default withStyles(styles)(Loader)
