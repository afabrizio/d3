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
		const arrow = null;
		return (
			<svg id="pan_control" height={controls} width={controls}>
				<g id="controls" transform={'translate(' + margin  + ' ' + margin + ')'}>
					<g id="directions">
						<g id="up">
							<rect x={control + margin} y={0} height={control} width={control} opacity={0.3}>
							</rect>
						</g>
						<g id="right">
							<rect x={2 * control + 2 * margin} y={control + margin} height={control} width={control} opacity={0.3}>
							</rect>
						</g>
						<g id="down">
							<rect x={control + margin} y={2 * control + 2 * margin} height={control} width={control} opacity={0.3}>
							</rect>
						</g>
						<g id="left">
							<rect x={0} y={control + margin} height={control} width={control} opacity={0.3}>
							</rect>
						</g>
					</g>
					<g id="center">
						<rect x={control + margin} y={control + margin} height={control} width={control} opacity={0.3}>
						</rect>
					</g>
				</g>
			</svg>
		);
	};
};
