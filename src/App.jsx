import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import './App.css';
import Navbar from './components/navbar/Navbar.jsx';
import Main from './components/main/Main.jsx';

class App extends Component {
	render() {
		return (
			<div className="app">
				<Navbar></Navbar>
				<Main></Main>
			</div>
		);
	};
};

export default hot(module)(App); 
