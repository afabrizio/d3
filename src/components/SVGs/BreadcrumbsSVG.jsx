import React, { Component } from 'react';
const themes = [
	{
		stroke: '#FFF',
		fill: '#00000055',
		text: '#000'
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
		const { fontSize, margin, strokeWidth, theme } = this.state;
		return ( 
			<g className="crumbs" transform={'translate(' + [ margin, margin ].join(' ') + ')'}>
				{breadcrumbs.reduce( (crumbs, crumb, i) => {
					const { fill = themes[theme]['fill'], text = '' } = crumb;
					const crumbWidth = (2 * strokeWidth) + (4 * margin) + (fontSize * text.length * 0.8);
					if (i > 0) {
						const { x0, dx, y0 } = crumbs[i - 1]; 
						if (x0 + dx + crumbWidth > this.props.maxLength) {
							crumbs.push({
								dx: crumbWidth,
								fill,
								text,
								x0: 2 * margin,
								y0: y0 + (2 * strokeWidth) + (2 * margin) + fontSize + margin
							});
						}
						else {
							crumbs.push({
								dx: crumbWidth,
								fill,
								text,
								x0: x0 + dx,
								y0
							});
						}
					}
					else {
						crumbs.push({
							dx: crumbWidth,
							fill,
							text,
							x0: 0,
							y0: 0,
						});
					}
					return crumbs;
				}, [])
				.map( ({ dx, fill, text, x0, y0 }, i) => {
					const points = (x0 === 0 && y0 === 0 ?
						[
							[ 0, 0 ],
							[ strokeWidth + (3 * margin) + (fontSize * text.length * 0.8), 0 ],
							[ (2 * strokeWidth) + (4 * margin) + (fontSize * text.length * 0.8), strokeWidth + margin + fontSize / 2 ],
							[ strokeWidth + (3 * margin) + (fontSize * text.length * 0.8), (2 * (strokeWidth + margin)) + fontSize ],
							[ 0, (2 * (strokeWidth + margin)) + fontSize ],
							[ 0, 0 ]
						]
						:
						[
							[ 0, 0 ],
							[ strokeWidth + (3 * margin) + (fontSize * text.length * 0.8), 0 ],
							[ (2 * strokeWidth) + (4 * margin) + (fontSize * text.length * 0.8), strokeWidth + margin + fontSize / 2 ],
							[ strokeWidth + (3 * margin) + (fontSize * text.length * 0.8), (2 * (strokeWidth + margin)) + fontSize ],
							[ 0, (2 * (strokeWidth + margin)) + fontSize ],
							[ strokeWidth + margin, strokeWidth + margin + fontSize / 2 ],
							[ 0, 0 ]
						]
						)
						.map( (d) => d.join(',') )
						.join(' ');
					return (
						<g className="crumb" transform={'translate(' + [ x0, y0 ].join(' ') + ')'} key={i}>
							<polygon points={points} fill={fill} stroke={themes[theme].stroke} strokeWidth={strokeWidth} />;
							<text transform={'translate(' + [ strokeWidth + (2 * margin), strokeWidth + margin ].join(' ') + ')'} dy={fontSize} letterSpacing={fontSize * 0.2} fontSize={fontSize} fontWeight={200} stroke={themes[theme]['text']}>{text}</text>
						</g>
					);
				} )}
			</g>
		);
	};

	render() {
		return (
			<svg id="breadcrumbs" width={this.props.maxLength || 400}>
				{this.crumbFactory(this.props.breadcrumbs)}
			</svg>
		);
	};
};
