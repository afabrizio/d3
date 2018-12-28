
import React, { Component } from 'react';

export default class ZoomControlSVG extends Component {
	constructor(props) {
		super(props);
	};

	render() {
		const margin = this.props.margin || 4;
		const control = this.props.size || 28; 
		const c = control / 2;
		const delta = control / 10;
		const d_in = [
			[ 'M', c, 2 * delta ],
			[ 'h', delta ],
			[ 'v', 2 * delta ],
			[ 'h', 2 * delta ],
			[ 'v', 2 * delta ],
			[ 'h', -2 * delta ],
			[ 'v', 2 * delta ],
			[ 'h', -2 * delta ],
			[ 'v', -2 * delta ],
			[ 'h', -2 * delta ],
			[ 'v', -2 * delta ],
			[ 'h', 2 * delta ],
			[ 'v', -2 * delta ],
			[ 'Z' ]
		]
			.map( (d) => d.join(' ') )
			.join(' ');
		const d_out = [
			[ 'M', 2 * delta, 4 * delta ],
			[ 'h', 6 * delta ],
			[ 'v', 2 * delta ],
			[ 'h', -6 * delta ],
			[ 'v', -2 * delta ],
			[ 'Z' ]
		]
			.map( (d) => d.join(' ') )
		  .join(' ');
		const styles = {
			button: {
				'cursor': 'pointer',
				'opacity': 0.3
			},
			path: {
				'opacity': 0.75,
				'pointerEvents': 'none'
			}
		};
		const zoom_in = <path style={styles.path} d={d_in} stroke="#000" strokeWidth={1} fill="transparent" />;
		const zoom_out = <path style={styles.path} d={d_out} stroke="#000" strokeWidth={1} fill="transparent" />;
		return (
			<svg id="zoom_control" >
				<g id="controls" transform={'translate(' + margin  + ' ' + margin + ')'}>
					<g id="in">
						<rect style={styles.button} height={control} width={control} onClick={() => this.props.zoomControlHandler(5)} />
						{zoom_in}
					</g>
					<g id="out" transform={'translate(' + [ 0, control + margin ].join(' ') + ')'}>
						<rect style={styles.button} height={control} width={control} onClick={() => this.props.zoomControlHandler(6)} />
						{zoom_out}
					</g>
				</g>
			</svg>
		);
	};
};
