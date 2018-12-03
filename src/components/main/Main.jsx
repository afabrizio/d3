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
				<HierarchySVG dataset={dataset} height='400' width='400'></HierarchySVG>
			</div>
		);
	};
};
