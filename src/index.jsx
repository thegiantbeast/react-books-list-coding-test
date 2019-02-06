import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

// remove default browser margin
document.body.style.margin = 0

ReactDOM.render(<App />, document.getElementById('app'))

module.hot.accept()