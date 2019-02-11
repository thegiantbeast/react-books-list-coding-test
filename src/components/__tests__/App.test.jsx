import React from 'react'
import { shallow } from 'enzyme'
import fetchMock from 'jest-fetch-mock'

global.fetch = fetchMock

import App from '../App'

const mockedData = [
    {
        title: 'mock title',
        author: {
            name: 'mock author name',
            gender: 'mock author gender'
        },
        genre: 'mock genre',
        publish_date: 123456789
    }
]

describe('App component', () => {
    beforeEach(() => {
        fetchMock.mockResponse(JSON.stringify(mockedData))
    })
    afterEach(() => {
        fetchMock.resetMocks()
    })

    it('should start with 2 empty state properties', () => {
        const wrapper = shallow(<App />)
        expect(Object.keys(wrapper.state()).length).toBe(5)
        expect(wrapper.state()).toEqual({
            isLoaded: false,
            genreList: [],
            data: null,
            filterData: null,
            filterOpts: {}
        })
    })

    it('should set data state property after async fetch call', (done) => {
        const wrapper = shallow(<App />)
        process.nextTick(() => {
            const expectedData = [ Object.assign({}, mockedData[0], { default_order: 0 }) ]
            expect(fetchMock.mock.calls.length).toEqual(1)
            expect(wrapper.state().data).toEqual(expectedData)
            done()
        })
    })
})