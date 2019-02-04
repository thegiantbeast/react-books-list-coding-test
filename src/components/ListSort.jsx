import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import SortIcon from '@material-ui/icons/Sort'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'

const styles = theme => ({

})

class ListSort extends Component {
    state = {
        anchorEl: null,
    }

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget })
    }

    handleClose = option => () => {
        this.setState({ anchorEl: null })
        this.props.sortBy(option)
    }

    render() {
        const { i18n } = this.props
        const { anchorEl } = this.state

        return [
            <Tooltip key={0} title={i18n.list.tooltips.sort}>
                <IconButton aria-owns={anchorEl ? 'sort-menu' : undefined} aria-haspopup="true" onClick={this.handleClick}>
                    <SortIcon />
                </IconButton>
            </Tooltip>,
            <Menu key={1} id='sort-menu' open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={this.handleClose}>
                <MenuItem onClick={this.handleClose('none')}>None</MenuItem>
                <MenuItem onClick={this.handleClose('book-title')}>Book Title</MenuItem>
                <MenuItem onClick={this.handleClose('author-name')}>Author Name</MenuItem>
            </Menu>
        ]
    }
}

export default withStyles(styles)(ListSort)