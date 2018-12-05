//bl.ocks.org/NPashaP/7683252
import React, { Component } from 'react';
import { select, selection } from 'd3-selection';

export default class HierarchySVG extends Component {
	constructor(props) {
		super(props);
		this.initialize = this.redraw.bind(this);
		this.SVG = React.createRef();
		const radius = 15;
		this.state = {
			root: {
				cx: props.width / 2,
				cy: 30
			},
			node: {
				borderColor: '#000',
				borderWidth: 2,
				fill: '#0FF',
				radius,
			},
			edge: {
				strokeColor: '#000',
				strokeWidth: 2,
			},
			offset: {
				dx: (2 * radius) + (this.props.dx || 10), 
				dy: (2 * radius) + (this.props.dy || 30) 
			},	
			nodes: [],
			edges: []
		};
	};

	componentDidMount() {
		console.log(this.props.dataset);
		const trees = this.computeTrees(this.props.dataset);
		console.log(trees);
		this.redraw(trees[0]);
	};

	componentDidUpdate() {
		const trees = this.computeTrees(this.props.dataset);
		this.redraw(trees[0]);
	};

	computeTrees(dataset = []) {
		const adopt = (parent, child, i) => {
			if (parent) {
				console.log('adopting child...')
				// if (parent.depth > 0 && i === child.children.length -1) {
				// 	parent.geometry.cx = parent.geometry.cx + (this.state.offset.dx * Math.floor(child.children.length / 2));
				// }
				const iCenter = (parent.degree - 1) / 2;
				const offsetDirection = (i === iCenter) ? 0 : (i < iCenter ? -1 : 1 );
				const offsetMultiplier = Math.ceil(Math.abs(i - iCenter));
				const node = {
					children: new Array(child.children.length), 
					degree: child.children.length,
					depth: parent.depth + 1,
					edges: [],
					id: child.id,
					label: child.label,
					level: parent.level + 1,
					geometry: {
						cx: parent.geometry.cx + (offsetDirection * offsetMultiplier * this.state.offset.dx) + (-1 * offsetDirection * (child.children.length % 2 === 0 ? 1 : 0) * (this.state.node.radius + 5)),
						cy: parent.geometry.cy + this.state.offset.dy,
						r: this.state.node.radius
					}
				};
				node.children = child.children.map( (child, i) => adopt(node, child, i) );
				return node;
			} else {
				console.log('adopting root...')
				const root = {
					children: new Array(child.children.length), 
					degree: child.children.length, 
					depth: 0,
					edges: [],
					id: child.id,
					label: child.label,
					level: 1,
					geometry: {
						cx: this.state.root.cx,
						cy: this.state.root.cy,
						r: this.state.node.radius
					}
				};
				root.children = child.children.map( (child, i) => adopt(root, child, i) );
				return root;
			}
			
		};
		return dataset.map( (root) => adopt(null, root, 0) );
	};

	redraw(root) {
		const extractCircles = (childNodes) => childNodes.reduce(
			(circles, node) => circles.concat(
				[ node.geometry ],
				extractCircles(node.children)
			),
			[]
		);
		const circles = [ { ...root.geometry } ].concat(extractCircles(root.children));
		console.log(circles);
		console.log(this.SVG.current)
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
				.data(circles)
				.enter()
				.append('circle')
				.attr('cx', ({ cx }) => cx)
				.attr('cy', ({ cy }) => cy)
				.attr('r', ({ r }) => r)
				.style('fill', this.state.node.fill)
				.style('stroke', this.state.node.borderColor)
				.style('strokeWidth', this.state.node.borderWidth)
				.on('click', (d) => console.log(d));
	};

	render() {
		return (
			<svg id="tree" ref={this.SVG} height={this.props.height} width={this.props.width}>
			</svg>
		);
	};
};
