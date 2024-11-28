import { CheckRun } from 'src/utils/createCheckRun.js'

import * as core from '@actions/core'
import { getInput } from '@actions/core'
import { exec } from '@actions/exec'

export async function CodeValidation() {
	core.startGroup('Code Validation')

	// const gitGuardian = await GitGuardian();
	// const codeQL = await CodeQL();
	const formatting = await CodeFormatting()
	// const linting = await CodeLinting();

	core.endGroup()
	return { summary: formatting.summary, text: formatting.text }
}

// async function GitGuardian() {
// 	const pm = getInput('package-manager');

// https://octokit.github.io/rest.js/v21/#secret-scanning-get-alert
// 	const check = new CheckRun({ name: 'GitGuardian' });
// 	check.create();

// 	const output = await exec(`${pm} run format`);
// 	const isSuccess = output.includes('All checks passed');

// 	// TODO - If changes, mention to fix it. Produce an error.

// 	const summary = `Status: ${isSuccess ? 'Success' : 'Failure'}\nScript ran = \`${pm} run all\` (TEXT SM)`;
// 	const text = `\`\`\` ${output} \`\`\``;

// 	check.update({ summary, text });
// 	return { summary, text };
// }

// async function CodeQL() {
// 	const pm = getInput('package-manager');

// https://octokit.github.io/rest.js/v21/#code-scanning
// 	const check = new CheckRun({ name: 'Formatting' });
// 	check.create();

// 	const output = await exec(`${pm} run format`);
// 	const isSuccess = output.includes('All checks passed');

// 	// TODO - If changes, mention to fix it. Produce an error.

// 	const summary = `Status: ${isSuccess ? 'Success' : 'Failure'}\nScript ran = \`${pm} run all\` (TEXT SM)`;
// 	const text = `\`\`\` ${output} \`\`\``;

// 	check.update({ summary, text });
// 	return { summary, text };
// }

async function CodeFormatting() {
	const pm = getInput('package-manager')

	const check = new CheckRun({ name: 'Formatting' })
	check.create()

	let output = ''
	let error = ''
	await exec(`${pm}`, ['run', 'format'], {
		listeners: {
			stdout: (data: Buffer) => {
				output += data.toString()
			},
			stderr: (data: Buffer) => {
				error += data.toString()
			},
		},
	})

	// TODO - Detect Exclusions that have been made and list them as warnings
	let exclusions = 4
	--exclusions

	core.info(output)
	core.error(error)

	const isSuccess = output.includes('All checks passed') // TODO - IDENTIFY FROM ERROR CODE
	const title =
		isSuccess ?
			`Passed with ${exclusions !== 0 ? `${exclusions} exclusions` : ''}`
		:	'3 errors and 2 warnings' // TODO
	const summary = `Status: ${isSuccess ? '✅ Success' : '❌ Failure'}\n <sub>Script executed = \`${pm} run format\`</sub>`
	const text = `\`\`\` ${output} \`\`\``
	const actions = [
		{
			label: 'Auto Format',
			description: 'Auto Format',
			identifier: 'auto-format',
		},
	]

	check.update({ isSuccess, title, summary, text, actions })
	return { summary, text }
}

// async function CodeLinting() {
// 	const pm = getInput('package-manager');

// 	const check = new CheckRun({ name: 'Formatting' });
// 	check.create();

// 	const code = await exec(`${pm} run lint:code`);
// 	const knip = await exec(`${pm} run lint:knip`);
// 	const spell = await exec(`${pm} run lint:cspell`);
// 	const md = await exec(`${pm} run lint:md`);

// 	// TODO - Detect Exclusions that have been made and list them as warnings

// 	// TODO - Produce an error
// 	// TODO - Button: Auto Format

// 	const isSuccess =
// 		spell.includes('All checks passed') &&
// 		knip.includes('All checks passed') &&
// 		code.includes('All checks passed') &&
// 		md.includes('All checks passed');
// 	const summary = `Status: ${isSuccess ? 'Success' : 'Failure'}\nScript ran = \`${pm} run all\` (TEXT SM)`;
// 	const text = `\`\`\` ${output} \`\`\``;

// 	check.update({ summary, text });
// 	return { summary, text };
// }
