import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';

const openSansFont = document.createElement('link');
openSansFont.setAttribute('rel', 'stylesheet');
openSansFont.setAttribute('href', 'https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,700,700i');
document.head.append(openSansFont);

ReactDOM.render(<App />, document.getElementById('root'));
