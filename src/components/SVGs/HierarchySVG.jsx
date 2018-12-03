//bl.ocks.org/NPashaP/7683252 
import React, { Component } from 'react';
import { select, selection } from 'd3-selection';

export default class HierarchySVG extends Component {
	constructor(props) {
		super(props);
		this.initialize = this.initialize.bind(this);
		this.SVG = React.createRef();
		this.state = {
			cx: props.width / 2,
			cy: props.height / 2,
			node: {
				radius: 15,
			},
		};
	};

	componentDidUpdate() {
		this.initialize();
	};

	initialize() {
		select(this.SVG.current)
			.append('g')
			.attr('id', 'lines')
			.selectAll('line')
				// .data()
				// .enter()
				// .append('line')
				// .attr('x1', ({ p1 }) => p1.x)
				// .attr('y1', ({ p1 }) => p1.y)
				// .attr('x2', ({ p2 }) => p2.x)
				// .attr('y2', ({ p2 }) => p2.y);
		select(this.SVG.current)
			.append('g')
			.attr('id', 'circles')
				.selectAll('circle')
				// .data()
				// .enter()
				// .append('circle')
				// .attr('cx', ({ p }) => p.x)
				// .attr('cy', ({ p }) => p.y)
				// .attr('r', this.state.node.radius)
				// .on('click', (d) => console.log(d));
	};

	render() {
		console.log(this.props.dataset);

		return (
			<svg id="tree" ref={this.SVG} height={this.props.height} width={this.props.width}>
			</svg>
		);
	};
};
