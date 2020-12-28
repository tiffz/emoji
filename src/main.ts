import React from 'react';
import ReactDOM from 'react-dom';
import Root from './Root';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(React.createElement(Root), document.getElementById('mount'));
});
