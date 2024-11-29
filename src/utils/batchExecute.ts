import { summary } from '@actions/core';
import { exec } from '@actions/exec';

export async function batchExecute(commands: CommandType[]) {
	const checkSummary = {
		isSuccess: true,
		title: '',
		summary: '',
		text: '',
		actions: [],
	};

	for (const command of commands) {
		let stdout = '';
		let stderr = '';

		const [pm, ...args] = command.cmd.split(' ');
		const exitCode = await exec(pm, args, {
			ignoreReturnCode: true,
			listeners: {
				stdout: (data: Buffer) => {
					stdout += data.toString();
				},
				stderr: (data: Buffer) => {
					stderr += data.toString();
				},
			},
		});

		const result = command.interpret({ stdout, stderr, exitCode });

		checkSummary.isSuccess &&= result.isSuccess;
		// checkSummary.title += title;
		// checkSummary.actions.push(...actions);
	}

	checkSummary.text += '2 commands success. Formatting failed';

	// checkSummary.summary += summary;

	// const actions = [];
	// let isSuccess = true;
	// let summary = '';
	// let title = '';
	// let text = '';

	// for (const command of commands) {
	// 	const result = await execute(command);
	// 	actions.push(...result.actions);
	// 	isSuccess &&= result.isSuccess;
	// 	text += `${result.text} <br/><br/>`;
	// 	title += `${result.title} <br/><br/>`;
	// 	summary += `${result.summary} <br/><br/>`;
	// }

	// check.update({ isSuccess, title, summary, text, actions });
	// return { name, summary, text };

	return {};
}
