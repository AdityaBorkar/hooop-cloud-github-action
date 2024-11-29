import { summary, startGroup, endGroup } from '@actions/core';

export async function CodePerformance() {
	startGroup('Code Performance');
	summary.addHeading('Code Performance', '2');

	// https://codspeed.io/pricing
	summary.addRaw('TBD', true);
	summary.addCodeBlock('TBD', 'bash');

	endGroup();
}
