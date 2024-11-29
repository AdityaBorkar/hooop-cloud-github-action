import { endGroup, summary } from '@actions/core';
import { startGroup } from '@actions/core';

export async function CodeTesting() {
	startGroup('Code Testing');
	summary.addHeading('Code Testing', '2');

	summary.addHeading('Test Results', '3');
	summary.addRaw('TBD', true);
	summary.addCodeBlock('TBD', 'bash');

	summary.addHeading('Test Coverage', '3');
	summary.addRaw('TBD', true);
	summary.addCodeBlock('TBD', 'bash');

	endGroup();
}
