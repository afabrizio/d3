//bl.ocks.org/NPashaP/7683252
import React, { Component } from 'react';
import { select, selection } from 'd3-selection';

export default class HierarchySVG extends Component {
	constructor(props) {
		super(props);
		this.initialize = this.initialize.bind(this);
		this.SVG = React.createRef();
		const radius = 15;
		const spacing = {
			dx: 10,
			dy: 30
		};
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
				dx: (2 * radius) + spacing.dx,
				dy: (2 * radius) + spacing.dy 
			},	
			nodes: [],
			edges: []
		};
	};

	componentDidUpdate() {
		this.initialize();
	};

	computeTree(dataset = []) {
		const adopt = (parent, child) => {
			if (parent) {
				console.log('adopting child...')
				const node = {
					children: child.children,
					degree: child.children.length,
					depth: parent.depth + 1,
					edges: [],
					id: child.id,
					label: child.label,
					level: parent.level + 1,
					geometry: {
						cx: 0,
						cy: 0,
						r: this.state.node.radius
					}
				};
				node.children = node.children.map( (child) => adopt(node, child) );
				return node;
			} else {
				console.log('adopting root...')
				const root = {
					children: child.children,
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
				root.children = root.children.map( (child) => adopt(root, child) );
				// parent.degree = parent.children.length;
				// const iCenter = (parent.degree - 1) / 2;
				// parent.children.forEach( (child, i) => {
				// 	const offsetDirection = (i === iCenter) ? 0 : (i < iCenter ? -1 : 1 );
				// 	const offsetMultiplier = Math.ceil(Math.abs(i - iCenter));
				// 	console.log(JSON.stringify(child));
				// 	// child.geometry.cx = parent.geometry.cx + (offsetDirection * offsetMultiplier);
				// 	// child.geometry.cy = parent.geometry.cy + this.state.offset.dy;
				// } );
				return root;
			}
			
		};
		const deriveGeometries = (tree = []) => {
			return tree;
		}

		return dataset.map( (root) => {
			const tree = adopt(null, root);
			return deriveGeometries(tree);
		} );
			
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
		const trees = this.computeTree(this.props.dataset);
		console.log(trees);

		return (
			<svg id="tree" ref={this.SVG} height={this.props.height} width={this.props.width}>
			</svg>
		);
	};
};
