import React, { Component } from 'react';
import BreadcrumbsSVG from '../SVGs/BreadcrumbsSVG.jsx';
import HierarchySVG from '../SVGs/HierarchySVG.jsx';
import PanControlSVG from '../SVGs/PanControlSVG.jsx';
import ZoomControlSVG from '../SVGs/ZoomControlSVG.jsx';
import dataset from '../../datasets/hierarchy.json';
import supplyChain from '../../datasets/supply_chain.json';

export default class Main extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		const nested = this.nestSupplyChain(supplyChain[0]);
		console.log(nested);
	};

	nestSupplyChain(raw = {}) {
		return {
			_id: raw['_id'],
			label: raw['label'],
			children: raw.supplyChain.reduce( (children, descendant) => {
				return children;
			}, [])
		};
	};
		

	render() {
		const panControlHandler = (direction = 0) => console.log(direction);
		const breadcrumbs = [ 'CTX', 'AMC', 'AMCOM' ] .map( c => ({ text: c }) );
		return (
			<div className='main'>
				<HierarchySVG dataset={dataset} height='600' width='800' />
				<PanControlSVG size={100} panControlHandler={panControlHandler} />
				<ZoomControlSVG size={28} zoomControlHandler={panControlHandler} />
				<div>
					<BreadcrumbsSVG maxLength={200} breadcrumbs={breadcrumbs} />
				</div>
			</div>
		);
	};
};
