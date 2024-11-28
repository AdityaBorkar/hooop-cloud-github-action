import core, { getInput, summary } from '@actions/core';
import { CodeValidation } from './functions/CodeValidation.js';
import { CodePerformance } from './functions/CodePerformance.js';
import { CodeTesting } from './functions/CodeTesting.js';
import { Preview } from './functions/Preview.js';
// import { PrValidation } from './functions/PrValidation.js';

export async function run() {
	try {
		// * Parameters

		const pm = getInput('packageManager', { required: true });
		if (!['bun', 'pnpm', 'npm'].includes(pm))
			throw new Error('We support only bun, pnpm, npm as package managers');

		const GithubToken = getInput('GithubToken', { required: true });
		if (!GithubToken) throw new Error('Github token is required');

		// * Run Functions

		const codeValidation = await CodeValidation();
		const codeTesting = await CodeTesting();
		const codePerformance = await CodePerformance();
		const preview = await Preview();
		// const prValidation = await PrValidation();

		// * Job Summary:

		summary.addHeading('Job Summary', '2');
		summary.addSeparator();
		summary.addList(
			[
				'[Code Validation](##CodeValidation)',
				'[Code Testing](##CodeTesting)',
				'[Code Performance](##CodePerformance)',
				'[Preview](##Preview)',
				// '[PR Validation](##PrValidation)',
			],
			true,
		);
		summary.addBreak();

		summary.addHeading('Code Validation', '2');
		summary.addSeparator();
		summary.addCodeBlock('', 'bash');

		summary.addHeading('Code Testing', '2');
		summary.addSeparator();
		summary.addCodeBlock('', 'bash');

		summary.addHeading('Code Performance', '2');
		summary.addSeparator();
		summary.addCodeBlock('', 'bash');

		summary.addHeading('Preview', '2');
		summary.addSeparator();
		summary.addCodeBlock('', 'bash');

		// summary.addHeading('PR Validation', '2');
		// summary.addSeparator();
		// summary.addCodeBlock('', 'bash');
	} catch (error: unknown) {
		core.setFailed(error instanceof Error ? error.message : String(error));
	}
}
