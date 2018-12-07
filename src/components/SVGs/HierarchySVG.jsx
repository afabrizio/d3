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
				cy: 20
			},
			node: {
				borderColor: '#000',
				borderWidth: 2,
				fill: '#FFF',
				radius,
			},
			edge: {
				strokeColor: '#000',
				strokeWidth: 2,
			},
			offset: {
				dx: (2 * radius) + (this.props.dx || 0), 
				dy: (2 * radius) + (this.props.dy || 30) 
			},	
		};
	};

	componentDidMount() {
		const trees = this.computeTrees(this.props.dataset);
		this.redraw(trees[0]);
	};

	componentDidUpdate() {
		const trees = this.computeTrees(this.props.dataset);
		this.redraw(trees[0]);
	};

	computeTrees(dataset = []) {
		const adopt = (parent, child, i) => {
			if (parent) {
				const iCenter = (parent.degree - 1) / 2;
				const offsetDirection = (i === iCenter) ? 0 : (i < iCenter ? -1 : 1 );
				const offsetMultiplier = Math.abs(i - iCenter);
				const node = {
					children: child.children,
					degree: child.children.length,
					depth: parent.depth + 1,
					edges: [],
					id: child.id,
					label: child.label,
					level: parent.level + 1,
					geometry: {
						cx: parent.geometry.cx + (offsetDirection * offsetMultiplier * this.state.offset.dx),
						cy: parent.geometry.cy + this.state.offset.dy,
						dx: 0,
						pos: offsetDirection,
						r: this.state.node.radius
					}
				};
				node.children = child.children.map( (child, i) => adopt(node, child, i) );
				return node;
			} else {
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
						dx: 0,
						pos: 0,
						r: this.state.node.radius
					}
				};
				root.children = child.children.map( (child, i) => adopt(root, child, i) );
				return root;
			}
			
		};
		const leafCount = (branch) => {
			if(branch.children.length) {
				return branch.children
					.map(leafCount)
					.reduce( (a, b) => a + b );
			} else {
				return 1;
			}
		};
		// repositioning needed due to sibling node geometries:
		const reposition = (branch) => {
			// repositions children according tp parents total offset thus far:
			branch.children.map( (child) => child.geometry.cx += branch.geometry.dx);
			// calculates spacing required for each branch child:
			const offsets = branch.children
				.map( (child, i) => {
					const adjustment = ((leafCount(child) - 1) * this.state.offset.dx) / (i === 0 || i === (branch.degree - 1) ? 2 : 1);
					if (child.geometry.pos === -1) {
						return {
							left: adjustment,
							right: 0,
						};
					} else if (child.geometry.pos === 0) {
						// NOT ALWAYS EVENLY DISTRIBUTED THOUGH!!
						return {
							left: adjustment / 2,
							right: adjustment / 2,
						};
						leafPath = (branch) => branch.reduce( (lr, child) => {
						}, [0, 0]);
						const distribution = (branch) => reduce( (children) => )
						const childLeafCount = child.children.map( (child) => leafCount(child) );
						console.log(childLeafCount);
					} else if (child.geometry.pos === 1) {
						return {
							left: 0,
							right: adjustment
						};
					}
				} );
			// offsets the branch children according to their sibling space requirements: 
			branch.children.map( (child, i) => {
				if (child.geometry.pos === -1) {
					const adjustment = offsets.reduce( (adjustment, { left }) => adjustment += left, 0);
					child.geometry.dx = branch.geometry.dx - adjustment;
					child.geometry.cx -= adjustment; 
				} else if (child.geometry.pos === 0) {
					child.geometry.dx = branch.geometry.dx;
				} else if (child.geometry.pos === 1) {
					const adjustment = offsets.reduce( (adjustment, { right }) => adjustment += right, 0);
					child.geometry.dx = branch.geometry.dx + adjustment;
					child.geometry.cx += adjustment; 
				}
			} );
			// recursion:
			branch.children.map( (child) => reposition(child) );
			return branch;
		};
		return dataset
			.map( (root) => adopt(null, root, 0) ) 
			.map( (tree) => reposition(tree) );
	};

	redraw(root) {
		const extractElements = (branch, elements = { circles: [], lines: [], labels: [] }) => {
			// circles:
			elements.circles.push(branch.geometry);
			// lines:
			branch.children.map( (child) => {
				elements.lines.push({
					x1: branch.geometry.cx,
					y1: branch.geometry.cy,
					x2: child.geometry.cx,
					y2: child.geometry.cy
				});
			} );
			branch.children.forEach( (child) => extractElements(child, elements) );
			return elements;
		};
		const { circles, lines } = extractElements(root);
		let edges = select(this.SVG.current)
			.append('g')
			.attr('id', 'lines')
			.selectAll('line')
				.data(lines);
		edges
			//.transition()
			//.duration(500)
			.enter()
			.append('line')
			.merge(edges)
			.attr('x1', ({ x1 }) => x1)
			.attr('y1', ({ y1 }) => y1)
			.attr('x2', ({ x2 }) => x2)
			.attr('y2', ({ y2 }) => y2)
			.attr('stroke-width', this.state.edge.strokeWidth)
			.attr('stroke', this.state.edge.strokeColor);
		edges
			.exit()
			.remove();
		const nodes = select(this.SVG.current)
			.append('g')
			.attr('id', 'circles')
			.selectAll('circle')
				.data(circles);
		nodes
		// .transition()
		//	.duration(500)
			.enter()
			.append('circle')
			.merge(nodes)
			.attr('cx', ({ cx }) => cx)
			.attr('cy', ({ cy }) => cy)
			.attr('r', ({ r }) => r)
			.style('fill', this.state.node.fill)
			.style('stroke', this.state.node.borderColor)
			.style('strokeWidth', this.state.node.borderWidth)
			.on('click', (d) => console.log(d));
		nodes
			.exit()
			.remove();
	};

	render() {
		return (
			<svg id="tree" ref={this.SVG} height={this.props.height} width={this.props.width}>
			</svg>
		);
	};
};
