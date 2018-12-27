//https://bl.ocks.org/NPashaP/7683252
//https://bl.ocks.org/mbostock/6123708
//https://bl.ocks.org/kerryrodden/7090426
//https://bl.ocks.org/mbostock/4e3925cdc804db257a86fdef3a032a45
import React, { Component } from 'react';
import { drag } from 'd3-drag';
import { easeCubicOut } from 'd3-ease';
import { event, select, selection } from 'd3-selection';
import { transition } from 'd3-transition';
import { zoom, zoomIdentity } from 'd3-zoom';

export default class HierarchySVG extends Component {
	constructor(props) {
		super(props);
		this.distribution = this.distribution.bind(this);
		this.initialize = this.initialize.bind(this);
		this.redraw = this.redraw.bind(this);
		this.tree = React.createRef();
		const margin = {
			bottom: 50,
			left: 50,
			right: 50,
			top: 50
		};
		const radius = 20;
		this.SVG = {
			breadcrumbs: {
			},
			header: {
			},
			legend: {
			},
			margin,
			tree: {
				container: {
					height: props.height - (margin.top + margin.bottom),
					width: props.width - (margin.left + margin.right)
				},
				root: {
					cx: (props.width - (margin.left + margin.right)) / 2,
					cy: radius + 2
				},
				node: {
					borderColor: '#FFF',
					borderWidth: 2,
					fill: '#CCC',
					radius,
				},
				edge: {
					strokeColor: '#FFF',
					strokeWidth: 2,
				},
				offset: {
					dx: (2 * radius) + (props.dx || 2 * radius), 
					dy: (2 * radius) + (props.dy || 4 * radius) 
				},
			},
			panner: null,
			zoom: {
				duration: 500,
				ease: easeCubicOut,
				level: 5,
			}
		};
		this.state = {
		};
	};

	componentDidMount() {
		this.initialize();
		const trees = this.computeTrees(this.props.dataset);
		console.log(trees);
		this.redraw(trees[0]);
	};

	componentDidUpdate() {
		const trees = this.computeTrees(this.props.dataset);
		this.redraw(trees[0]);
	};

	adopt(parent, child, i) {
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
					// cx: parent.geometry.cx + (offsetDirection * offsetMultiplier * this.SVG.treee.offset.dx),
					cx: 0, 
					cy: parent.geometry.cy + this.SVG.tree.offset.dy,
					dx: 0,
					pos: offsetDirection,
					r: this.SVG.tree.node.radius
				},
				id: child.id,
				label: child.label,
				level: parent.level + 1,
				parent,
				rank: i,
				width: parent.degree
			};
			node.children = child.children.map( (child, i) => this.adopt(node, child, i) );
			return node;
		}
		else {
			const root = {
				children: child.children, 
				degree: child.children.length, 
				depth: 0,
				edges: [],
				geometry: {
					cx: this.SVG.tree.root.cx,
					cy: this.SVG.tree.root.cy,
					pos: 0,
					r: this.SVG.tree.node.radius
				},
				id: child.id,
				label: child.label,
				level: 1,
				parent: null,
				rank: 0,
				width: null
			};
			root.children = child.children
				.map( (child, i) => this.adopt(root, child, i) );
			return root;
		}
	};

	distribution(branch) {
		// calculates spacing required for each branch child:
		// each branch will have a Left - Right distribution that is not always balanced
		// therefore, each branch must calculate its distribution
		// check one level at a time, using recursion, decend until hit leaf
		if (branch.children.length) {
			const dist = branch.children
				.map(this.distribution)
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

	leafCount(branch) {
		if (branch.children.length) {
			return branch.children
				.map(leafCount)
				.reduce( (a, b) => a + b, 0 );
		}
		else {
			return 1;
		}
	};

	reposition(branch) {
		// repositions children according to parent's cx: 
		branch.children.map( (child) => child.geometry.cx = child.parent ? child.parent.geometry.cx : 0 );
		// offsets the branch children according to their sibling space requirements: 
		const distributions = branch.children.map(this.distribution);
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
				child.geometry.cx -= ((offset1 + offset2 + offset3) * this.SVG.tree.offset.dx); 
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
				child.geometry.cx += ((offset1 + offset2 + offset3) * this.SVG.tree.offset.dx); 
			}
		} );
		// recursion:
		branch.children.map( (child) => this.reposition(child) );
		return branch;
	};

	computeTrees(dataset = []) {
		return dataset
			// assembles tree data structure:
			.map( (root) => this.adopt(null, root, 0) ) 
			// applies necessary repositions needed due to sibling node geometries:
			.map( (tree) => this.reposition(tree) );
	};

	initialize() {
		const treeContainer = select(this.tree.current);
		treeContainer.attr('transform', `translate(${this.SVG.margin.left}, ${this.SVG.margin.top})`);
		this.SVG.panner = treeContainer
			.append('rect')
				.attr('id', 'panner')
				.attr('height', this.SVG.tree.container.height)
				.attr('width', this.SVG.tree.container.width)
				.attr('fill', '#272B2E')
				.attr('pointer-events', 'all')
				.call(zoom()
					.scaleExtent([0.25, 4])
					.on('zoom', () => {
						const { transform } = event;
						treeContainer.selectAll('g')
							.attr('transform', transform);
					})
				);
	};

	redraw(root) {
		const self = this;
		// defines function to extract SVG shape attributes:
		const extractElements = (branch, elements = { circles: [], lines: [], labels: [] }) => {
			// circles:
			elements.circles.push({
				id: branch.id,
				...branch.geometry
			});
			// labels:
			elements.labels.push({
				cx: branch.geometry.cx,
				cy: branch.geometry.cy,
				text: branch.label
			});
			// lines:
			branch.children.map( (child) => {
				elements.lines.push({
					x1: branch.geometry.cx,
					y1: branch.geometry.cy,
					x2: child.geometry.cx,
					y2: child.geometry.cy
				});
			} );
			// recursion:
			branch.children.map( (child) => extractElements(child, elements) );
			return elements;
		};
		const { circles, labels, lines } = extractElements(root);
		let edges = select(this.tree.current)
			.append('g')
			.attr('id', 'lines')
			.selectAll('line')
				.data(lines);
		edges
			.enter()
			.append('line')
			.merge(edges)
			.attr('x1', ({ x1 }) => x1)
			.attr('y1', ({ y1 }) => y1)
			.attr('x2', ({ x2 }) => x2)
			.attr('y2', ({ y2 }) => y2)
			.attr('stroke-width', this.SVG.tree.edge.strokeWidth)
			.attr('stroke', this.SVG.tree.edge.strokeColor);
		edges
			.exit()
			.remove();
		const redraw = transition().duration(500);
		const nodes = select(this.tree.current)
			.append('g')
			.attr('id', 'circles')
			.selectAll('circle')
				.data(circles);
			nodes
				.transition(redraw);
		nodes
			.enter()
			.append('circle')
			.merge(nodes)
			.attr('key', ({ id }) => id)
			.attr('cx', ({ cx }) => cx)
			.attr('cy', ({ cy }) => cy)
			.attr('r', ({ r }) => r)
			.style('fill', this.SVG.tree.node.fill)
			.style('stroke', this.SVG.tree.node.borderColor)
			.style('stroke-width', this.SVG.tree.node.borderWidth)
			.style('cursor', 'pointer')
			.on('mouseenter', function() {
				const node = select(this);
				node
					.style('stroke-width', self.SVG.tree.node.borderWidth * 2)
					.style('stroke', '#0FF');
			} )
			.on('mouseleave', function() {
				const node = select(this);
				node
					.style('stroke-width', self.SVG.tree.node.borderWidth)
					.style('stroke', self.SVG.tree.node.borderColor);
			} )
			.on('click', (d) => console.log(d));
		nodes
			.exit()
			.remove();
		let text = select(this.tree.current)
			.append('g')
			.attr('id', 'labels')
			.selectAll('text')
				.data(labels);
		text
			.enter()
			.append('text')
			.merge(text)
			.attr('x', ({ cx }) => cx)
			.attr('y', ({ cy }) => cy)
			.attr('dy', 5)
			.attr('textLength', this.SVG.tree.node.radius * 1.5)
			.attr('lengthAdjust', 'spacingAndGlyphs')
			.style('text-anchor', 'middle')
			.style('font-size', '10px')
			.style('font-weight', 'bold')
			.attr('pointer-events', 'none')
			.text(({ text }) => text);
		text
			.exit()
			.remove();
	};

	render() {
		const styles = {
			SVG: {
				backgroundColor: '#FFF',
				border: 'solid 1px #272B2E'
			},
		};
		return (
			<svg height={this.props.height} width={this.props.width} style={styles.SVG}>
				<defs>
					<clipPath id="tree-container">
						<rect x="0" y="0" height={this.SVG.tree.container.height} width={this.SVG.tree.container.width} />
					</clipPath>
				</defs>
				<g ref={this.tree} clipPath="url(#tree-container)"></g> 
			</svg>
		);
	};
};
