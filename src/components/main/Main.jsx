import React, { Component } from 'react';
import HierarchySVG from '../SVGs/HierarchySVG.jsx';
import dataset from '../../datasets/hierarchy.json';

export default class Main extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	};

	render() {
		return (
			<div className='main'>
				<HierarchySVG dataset={dataset} height='600' width='800'></HierarchySVG>
			</div>
		);
	};
};
