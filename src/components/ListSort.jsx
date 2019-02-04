import React, {Component} from 'react'
import { withStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import SortIcon from '@material-ui/icons/Sort'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'

const styles = theme => ({

})

class ListSort extends Component {
    render() {
        const { i18n } = this.props

        return [
            <Tooltip key={0} title={i18n.list.tooltips.sort}>
                <IconButton buttonRef={node => { this.sortEl = node }} aria-label={i18n.list.tooltips.sort}>
                    <SortIcon />
                </IconButton>
            </Tooltip>,
            <Popper key={1} open={open} anchorEl={this.anchorEl} transition disablePortal>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        id="menu-list-grow"
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={this.handleClose}>
                                <MenuList>
                                <MenuItem onClick={this.handleClose}>Book Title</MenuItem>
                                <MenuItem onClick={this.handleClose}>Author Name</MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        ]
    }
}

export default withStyles(styles)(ListSort)