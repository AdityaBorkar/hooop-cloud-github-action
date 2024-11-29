import { CheckRun } from 'src/utils/createCheckRun.js'
import { execute } from 'src/utils/execute.js'

import { endGroup, startGroup } from '@actions/core'

export async function CodeValidation() {
	startGroup('Code Validation')

	// const codeQL = await CodeQL();
	const formatting = await CodeFormatting()
	const linting = await CodeLinting()

	endGroup()
	return [formatting, linting]
}

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
	const name = 'Formatting'
	const commands = [{ cmd: 'bun run format' }] // TODO - Get from Application Settings

	const check = new CheckRun({ name })
	check.create()

	const actions = []
	let isSuccess = true
	let summary = ''
	let title = ''
	let text = ''

	for (const { cmd } of commands) {
		const { exitCode, output, error } = await execute(cmd)

		// TODO - Detect Exclusions that have been made and list them as warnings
		let exclusions = 1
		--exclusions

		const IS_SUCCESS = exitCode === 0
		const TITLE =
			(
				IS_SUCCESS // TODO - Personalize as per command
			) ?
				`Passed ${exclusions !== 0 ? `with ${exclusions} exclusions` : ''}`
			:	output.split('.')[2]
		const SUMMARY = `**Status:** ${IS_SUCCESS ? '✅' : '❌'} ${TITLE} \n <sub>Script executed = \`${cmd}\`</sub>`
		const TEXT = `\`\`\` ${output} \`\`\``
		const ACTIONS = [
			// TODO - Personalize as per command
			{
				label: 'Auto Format',
				description: 'Auto Format',
				identifier: 'auto-format',
			},
		]

		actions.push(...ACTIONS)
		isSuccess &&= IS_SUCCESS
		summary += SUMMARY
		title += TITLE
		text += TEXT
	}

	check.update({ isSuccess, title, summary, text, actions })
	return { name, summary, text }
}

async function CodeLinting() {
	const name = 'Linting'
	const commands = [
		{ cmd: 'bun run lint:code' },
		{ cmd: 'bun run lint:knip' },
		{ cmd: 'bun run lint:cspell' },
		{ cmd: 'bun run lint:md' },
	] // TODO - Get from Application Settings

	const check = new CheckRun({ name })
	check.create()

	const actions = []
	let isSuccess = true
	let summary = ''
	let title = ''
	let text = ''

	for (const { cmd } of commands) {
		const { exitCode, output, error } = await execute(cmd)

		// TODO - Detect Exclusions that have been made and list them as warnings
		let exclusions = 1
		--exclusions

		const IS_SUCCESS = exitCode === 0
		const TITLE =
			(
				IS_SUCCESS // TODO - Personalize as per command
			) ?
				`Passed ${exclusions !== 0 ? `with ${exclusions} exclusions` : ''}`
			:	output.split('.')[2]
		const SUMMARY = `**Status:** ${IS_SUCCESS ? '✅' : '❌'} ${TITLE} \n <sub>Script executed = \`${cmd}\`</sub>`
		const TEXT = `\`\`\` ${output} \`\`\``
		const ACTIONS = [
			// TODO - Personalize as per command
			{
				label: 'Auto Format',
				description: 'Auto Format',
				identifier: 'auto-format',
			},
		]

		actions.push(...ACTIONS)
		isSuccess &&= IS_SUCCESS
		summary += SUMMARY
		title += TITLE
		text += TEXT
	}

	check.update({ isSuccess, title, summary, text, actions })
	return { name, summary, text }
}
