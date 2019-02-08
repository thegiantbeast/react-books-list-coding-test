import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import FilterListIcon from '@material-ui/icons/FilterList'
import Menu from '@material-ui/core/Menu'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        '&:focus': {
            outline: 'none'
        }
    },
    formControl: {
        margin: theme.spacing.unit * 2,
        minWidth: 160,
        '&:focus': {
            outline: 'none'
        }
    },
})

class ListFilter extends Component {
    state = {
        anchorEl: null,
        genre: '',
        'author.gender': ''
    }

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget })
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value, anchorEl: null })
        this.props.filterBy(event.target.name, event.target.value)
    }

    handleClose = () => {
        this.setState({ anchorEl: null })
    }

    render() {
        const { classes, i18n, genreList } = this.props
        const { anchorEl } = this.state

        let genreMenuItems = []
        for(let i = 0; i < genreList.length; i++) {
            genreMenuItems.push(<MenuItem key={i} value={genreList[i]}>{genreList[i]}</MenuItem>)
        }

        return [
            <Tooltip key={0} title={i18n.list.tooltips.filter}>
                <IconButton aria-owns={anchorEl ? 'filter-menu' : undefined} aria-haspopup="true" onClick={this.handleClick}>
                    <FilterListIcon />
                </IconButton>
            </Tooltip>,
            <Menu key={1} id='filter-menu' className={classes.root} open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={this.handleClose}>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="filter-genre">{i18n.list.tooltips.filterGenre}</InputLabel>
                    <Select value={this.state.genre} onChange={this.handleChange} inputProps={{ name: 'genre', id: 'filter-genre' }}>
                        <MenuItem value="none">
                            <em>{i18n.list.tooltips.none}</em>
                        </MenuItem>
                        {genreMenuItems}
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="filter-authorGender">{i18n.list.tooltips.filterAuthorGender}</InputLabel>
                    <Select value={this.state['author.gender']} onChange={this.handleChange} inputProps={{ name: 'author.gender', id: 'filter-authorGender' }}>
                        <MenuItem value="none">
                            <em>{i18n.list.tooltips.none}</em>
                        </MenuItem>
                        <MenuItem value={i18n.list.tooltips.filterGenderMale}>{i18n.list.tooltips.filterGenderMale}</MenuItem>
                        <MenuItem value={i18n.list.tooltips.filterGenderFemale}>{i18n.list.tooltips.filterGenderFemale}</MenuItem>
                    </Select>
                </FormControl>
            </Menu>
        ]
    }
}

export default withStyles(styles)(ListFilter)
