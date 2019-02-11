import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import SortIcon from '@material-ui/icons/Sort'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

const styles = theme => ({

})

class ListSort extends Component {
    state = {
        anchorEl: null
    }

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget })
    }

    handleClose = option => () => {
        this.setState({ anchorEl: null })
        if (option) {
            this.props.sortBy(option)
        }
    }

    render() {
        const { i18n } = this.props
        const { anchorEl } = this.state

        return (
            <React.Fragment>
                 <Tooltip title={i18n.list.tooltips.sort}>
                    <IconButton aria-owns={anchorEl ? 'sort-menu' : undefined} aria-haspopup="true" onClick={this.handleClick}>
                        <SortIcon />
                    </IconButton>
                </Tooltip>
                <Menu id='sort-menu' open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={this.handleClose()}>
                    <MenuItem onClick={this.handleClose('none')}><em>{i18n.list.tooltips.none}</em></MenuItem>
                    <MenuItem onClick={this.handleClose('book-title')}>{i18n.list.tooltips.sortBookTitle}</MenuItem>
                    <MenuItem onClick={this.handleClose('author-name')}>{i18n.list.tooltips.sortAuthorName}</MenuItem>
                </Menu>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(ListSort)
