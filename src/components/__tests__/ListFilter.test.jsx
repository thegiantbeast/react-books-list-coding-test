import React from 'react'
import { mount, shallow } from 'enzyme'
import ListFilter from '../ListFilter'
import i18n from '../../translations'

describe('App component', () => {
    it('should start with 3 empty state properties', () => {
        const wrapper = mount(shallow(<ListFilter i18n={i18n} genreList={[]} />).get(0))
        expect(Object.keys(wrapper.state()).length).toBe(3)
        expect(wrapper.state()).toEqual({
            anchorEl: null,
            'author.gender': '',
            genre: ''
        })
    })
})