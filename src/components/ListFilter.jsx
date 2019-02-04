import React, {Component} from 'react'
import { withStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import FilterListIcon from '@material-ui/icons/FilterList'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'

const styles = theme => ({

})

class ListFilter extends Component {
    render() {
        const { i18n } = this.props

        return [
            <Tooltip title={i18n.list.tooltips.filter}>
                <IconButton buttonRef={node => { this.filterEl = node }} aria-label={i18n.list.tooltips.filter}>
                    <FilterListIcon />
                </IconButton>
            </Tooltip>
        ]
    }
}

export default withStyles(styles)(ListFilter)


