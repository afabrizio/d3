import React, { Component } from 'react';

export default class PanControlSVG extends Component {
	constructor(props) {
		super(props);
	};

	render() {
		const margin = this.props.margin || 4;
		const controls = this.props.size || 100;
		const control = (controls - (4 * margin)) / 3;
		const c = controls / 2;
		const delta = control / 10;
		const d_arrow = [
			[ 'M', control / 2, 2 * delta ],
			[ 'l', 3 * delta, 3 * delta ],
			[ 'v', 2 * delta ],
			[ 'l', -3 * delta, -3 * delta ],
			[ 'l', -3 * delta, 3 * delta ],
			[ 'v', -2 * delta ],
			[ 'Z' ]
		]
			.map( (d) => d.join(' ') )
			.join(' ');
		const d_center = [
			[ 'M', control / 2, control / 2 ],
			[ 'm', 0, -1.5 * delta ], 
			[ 'a', 1.5 * delta, 1.5 * delta, 0, 1, 0, 0.01, 0 ],
			[ 'Z' ],
			[ 'M', control / 2, control / 2 ],
			[ 'm', 0, -2.5 * delta ], 
			[ 'a', 2.5 * delta,  2.5 * delta, 0, 1, 0, 0.01, 0 ],
			[ 'Z' ],
			[ 'm', 0, 0 ],
			[ 'v', -delta ],
			[ 'm', 0, 6 * delta ],
			[ 'v', delta ],
			[ 'm', -3.5 * delta, -3.5 * delta ],
			[ 'h', delta ],
			[ 'm', 6 * delta, 0 ],
			[ 'h', -delta ],
		]
			.map( (d) => d.join(' ') )
		  .join(' ');
		const styles = {
			button: {
				'fill': '#FFF',
				'cursor': 'pointer',
				'opacity': 0.9
			},
			path: {
				'pointerEvents': 'none'
			}
		};
		const arrow = <path style={styles.path} d={d_arrow} stroke="#000" strokeWidth={1} fill="transparent" />;
		const center = <path style={styles.path} d={d_center} stroke="#000" strokeWidth={1} fill="transparent" />;
		return (
			<svg id="pan_control" height={controls} width={controls}>
				<g id="controls" transform={'translate(' + margin  + ' ' + margin + ')'}>
					<g id="directions" transform={'translate(' + [ (control + margin), (control + margin) ].join(' ') + ')'}>
						<g id="up" transform={'translate(' + [ 0, -(control + margin) ].join(' ') + ')'}>
							<rect style={styles.button} height={control} width={control} onClick={() => this.props.panControlHandler(1)} />
							{arrow}
						</g>
						<g id="right" transform={'translate(' + [ 2 * control + margin, 0 ].join(' ') + ') rotate(90)'}>
							<rect style={styles.button} height={control} width={control} onClick={() => this.props.panControlHandler(2)} />
							{arrow}
						</g>
						<g id="down" transform={'translate(' + [ control, 2 * control + margin ].join(' ') + ') rotate(180)'}>
							<rect style={styles.button} height={control} width={control} onClick={() => this.props.panControlHandler(3)} />
							{arrow}
						</g>
						<g id="left" transform={'translate(' + [ -(control + margin), control ].join(' ') + ') rotate(270)'}>
							<rect style={styles.button} height={control} width={control} onClick={() => this.props.panControlHandler(4)} />
							{arrow}
						</g>
					</g>
					<g id="center" transform={'translate(' + [ (control + margin), (control + margin) ].join(' ') + ')'}>
						<rect style={styles.button} height={control} width={control} onClick={() => this.props.panControlHandler(0)} />
						{center}
					</g>
				</g>
			</svg>
		);
	};
};
