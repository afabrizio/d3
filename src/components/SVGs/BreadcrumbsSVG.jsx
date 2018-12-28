import React, { Component } from 'react';
const themes = [
	{
		stroke: '#FFF',
		fill: '#00000055',
		text: '#FFF'
	}
];

export default class BreadcrumbsSVG extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fontSize: 10,
			margin: props.margin || 10,
			strokeWidth: props.strokeWidth || 2,
			theme: props.theme || 0,
		};
	};

	crumbFactory(breadcrumbs = []) {
		// TODO: forEach to reduce. offset is relative to previous length, not current text length!
		breadcrumbs.forEach( (crumb, i, crumbs) => {
			const { fill = themes[this.state.theme]['fill'], stroke = themes[this.state.theme]['stroke'], text } = crumb;
			let offset = {
				dx: 0,
				dy: 0
			};
			if (i > 0) {
				offset = {
					dx: crumbs[i - 1]['offset']['dx'] + (this.state.fontSize * text.length) + (2 * (this.state.margin + this.state.strokeWidth)),
					dy: crumbs[i - 1]['offset']['dy']
				};
				// adjusts offsets for line wrapping:
				if (offset.dx > (this.props.maxLength || 0)) {
					offset.dx = 0; 
					offset.dy += 10 + (2 * (this.state.margin + this.state.strokeWidth));
				}
			}
			crumbs[i] = { fill, offset, stroke, text };
		} );
		return (
			<g className="crumbs" transform={'translate(' + [ this.state.margin, this.state.margin ].join(' ') + ')'}>
				{breadcrumbs.map( ({ fill, offset, stroke, text }, i) => {
					const points = [
						[ 0, 0 ],
						[ this.state.strokeWidth + this.state.margin + (this.state.fontSize * text.length), 0 ],
						[ (2 * (this.state.strokeWidth + this.state.margin)) + (this.state.fontSize * text.length), this.state.strokeWidth + this.state.margin + this.state.fontSize / 2 ],
						[ this.state.strokeWidth + this.state.margin + (this.state.fontSize * text.length), (2 * (this.state.strokeWidth + this.state.margin)) + this.state.fontSize ],
						[ 0, (2 * (this.state.strokeWidth + this.state.margin)) + this.state.fontSize ],
						[ this.state.strokeWidth + this.state.margin, this.state.strokeWidth + this.state.margin + this.state.fontSize / 2 ],
						[ 0, 0 ]
					]
						.map( (d) => d.join(',') )
						.join(' ');
					return (
						<g className="crumb" transform={'translate(' + [ offset.dx, offset.dy ].join(' ') + ')'} key={i}>
							<polygon points={points} fill={fill} stroke={stroke} strokeWidth={this.state.strokeWidth} />;
							<text transform={'translate(' + [ this.state.strokeWidth + this.state.margin, this.state.strokeWidth + this.state.margin ].join(' ') + ')'} dy={this.state.fontSize / 2} textAnchor="center" fontSize={this.state.fontSize} stroke={themes[this.state.theme]['text']}>{text}</text>
						</g>
					);
				} )}
			</g>
		);
	};

	render() {
		return (
			<svg id="breadcrumbs" width={this.props.maxLength || 200}>
				{this.crumbFactory(this.props.breadcrumbs)}
			</svg>
		);
	};
};
