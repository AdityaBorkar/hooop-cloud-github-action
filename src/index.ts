import { CodePerformance } from './functions/CodePerformance.js';
import { CodeTesting } from './functions/CodeTesting.js';
import { CodeValidation } from './functions/CodeValidation.js';
import { Preview } from './functions/Preview.js';
import { setFailed, summary } from '@actions/core';

async function run() {
	try {
		// * Parameters

		const GithubToken = process.env.GITHUB_TOKEN;
		if (!GithubToken) throw new Error('Github token is required');

		// * Job Summary:

		// summary.addHeading('Job Summary', '2')
		// summary.addList([
		// 	'<a href="#code-validation">Code Validation</a>',
		// 	'<a href="#code-testing">Code Testing</a>',
		// 	'<a href="#code-performance">Code Performance</a>',
		// 	'<a href="#preview">Preview</a>',
		// ])

		// * Run Functions

		await CodeValidation();
		summary.addBreak();
		// await CodeTesting();
		// summary.addBreak();
		// await CodePerformance();
		// summary.addBreak();
		// await Preview();
		summary.write();
	} catch (error: unknown) {
		setFailed(error instanceof Error ? error.message : String(error));
	}
}

run();
