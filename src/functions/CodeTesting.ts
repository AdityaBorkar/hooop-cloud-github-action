import * as core from '@actions/core'

export async function CodeTesting() {
	core.startGroup('Code Testing')

	// const testing = await CodeTesting();

	core.endGroup()
	return { summary: '', text: '' }
}

// async function CodeTesting() {
// 	const pm = getInput('package-manager');

// 	const check = new CheckRun({ name: 'Formatting' });
// 	check.create();

// 	const output = await exec(`${pm} run format`);
// 	const isSuccess = output.includes('All checks passed');

// 	// TODO - Produce an error

// 	const summary = `Status: ${isSuccess ? 'Success' : 'Failure'}\nScript ran = \`${pm} run all\` (TEXT SM)`;
// 	const text = `\`\`\` ${output} \`\`\``;

// 	check.update({ summary, text });
// 	return { summary, text };
// }
