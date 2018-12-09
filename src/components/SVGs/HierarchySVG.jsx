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
				const iCenter = (parent.degree - 1) / 2;
				const offsetDirection = (i === iCenter) ? 0 : (i < iCenter ? -1 : 1 );
				const offsetMultiplier = Math.abs(i - iCenter);
				const node = {
					children: child.children,
					degree: child.children.length,
					depth: parent.depth + 1,
					edges: [],
					geometry: {
						// cx: parent.geometry.cx + (offsetDirection * offsetMultiplier * this.state.offset.dx),
						cx: 0, 
						cy: parent.geometry.cy + this.state.offset.dy,
						dx: 0,
						pos: offsetDirection,
						r: this.state.node.radius
					},
					id: child.id,
					label: child.label,
					level: parent.level + 1,
					parent,
					rank: i,
					width: parent.degree
				};
				node.children = child.children.map( (child, i) => adopt(node, child, i) );
				return node;
			}
			else {
				const root = {
					children: child.children, 
					degree: child.children.length, 
					depth: 0,
					edges: [],
					geometry: {
						cx: this.state.root.cx,
						cy: this.state.root.cy,
						pos: 0,
						r: this.state.node.radius
					},
					id: child.id,
					label: child.label,
					level: 1,
					parent: null,
					rank: 0,
					width: null
				};
				root.children = child.children
					.map( (child, i) => adopt(root, child, i) );
				return root;
			}
			
		};
		const leafCount = (branch) => {
			if (branch.children.length) {
				return branch.children
					.map(leafCount)
					.reduce( (a, b) => a + b, 0 );
			}
			else {
				return 1;
			}
		};
		const distribution = (branch) => {
			// calculates spacing required for each branch child:
			// each branch will have a Left - Right distribution that is not always balanced
			// therefore, each branch must calculate its distribution
			// check one level at a time, using recursion, decend until hit leaf
			if (branch.children.length) {
				const dist = branch.children
					.map(distribution)
					.reduce( ({ L, R }, d, i) => {
						const pos = branch.children[i].geometry.pos;
						if (pos === -1) {
							L += (d.L + d.R);
						}
						else if (pos === 0) {
							L += d.L;
							R += d.R;
						}
						else if (pos === 1) {
							R += (d.L + d.R); 
						}
						return { L, R };
					}, { L: 0, R: 0 });
				//console.log('(node) dist:', dist);
				return dist;
			}
			else {
				//console.log('(leaf) dist:', { L: 0.5, R: 0.5 })
				return { L: 0.5, R: 0.5 };
			}
		};
		// repositioning needed due to sibling node geometries:
		const reposition = (branch) => {
			// repositions children according to parent's cx: 
			branch.children.map( (child) => child.geometry.cx = child.parent ? child.parent.geometry.cx : 0 );
			// offsets the branch children according to their sibling space requirements: 
			const distributions = branch.children.map(distribution);
			branch.children.map( (child, i) => {
				/* 
					child.pos = -1:
						R(child) + LR(all siblings of >rank with pos=-1) + L(all siblings with pos=0)
					child.pos = 0:
						nothing
					child.pos = 1:
						L(child) + LR(all siblings of <rank with pos=1) + R(all siblings with pos=0)
				*/
				if (child.geometry.pos === -1) {
					const offset1 = distributions[i].R;
					const offset2 = branch.children
						.reduce( (indicies, { rank, geometry }, i) => {
							if ((rank > child.rank) && (geometry.pos === -1)) {
								indicies.push(i);
							}
							return indicies;
						}, [])
						.reduce( (offset, i) => offset += (distributions[i].L + distributions[i].R), 0);
					const offset3 = branch.children
						.reduce( (indicies, { rank, geometry }, i) => {
							if (geometry.pos === 0) {
								indicies.push(i);
							}
							return indicies;
						}, [])
						.reduce( (offset, i) => offset += distributions[i].L, 0);
					child.geometry.cx -= ((offset1 + offset2 + offset3) * this.state.offset.dx); 
				}
				else if (child.geometry.pos === 0) {
				}
				else if (child.geometry.pos === 1) {
					const offset1 = distributions[i].L;
					const offset2 = branch.children
						.reduce( (indicies, { rank, geometry }, i) => {
							if ((rank < child.rank) && (geometry.pos === 1)) {
								indicies.push(i);
							}
							return indicies;
						}, [])
						.reduce( (offset, i) => offset += (distributions[i].L + distributions[i].R), 0);
					const offset3 = branch.children
						.reduce( (indicies, { rank, geometry }, i) => {
							if (geometry.pos === 0 ) {
								indicies.push(i);
							}
							return indicies;
						}, [])
						.reduce( (offset, i) => offset += distributions[i].R, 0);
					child.geometry.cx += ((offset1 + offset2 + offset3) * this.state.offset.dx); 
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

	redraw(root){
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
