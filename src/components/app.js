import moment from 'moment/moment';
import React, { Component } from 'react';

export default class App extends Component {
  render() {
    return (
      <div className='app'>
        <h1>Ryan Schmutzler Portfolio</h1>

        <div>
          {moment().format('MMM Do YYY, h:mm:ss a')}
        </div>
      </div>
    );
  }
}
