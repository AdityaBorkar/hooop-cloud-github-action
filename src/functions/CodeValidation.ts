import { endGroup, startGroup, summary } from '@actions/core';

import { execute } from 'src/utils/execute.js';
import { createCheckRun } from 'src/utils/createCheckRun.js';
import { escapeMd } from 'src/utils/escapeMd.js';

export async function CodeValidation() {
	startGroup('Code Validation');
	summary.addHeading('Code Validation', '2');

	for await (const { check, commands } of CHECKS) {
		summary.addHeading(check.name, '2');
		const checkRun = await createCheckRun(check);

		const cmdCount = { success: 0, failure: 0 };
		for (const command of commands) {
			const { result, stdout, stderr } = await execute(command);
			cmdCount[result.isSuccess ? 'success' : 'failure'] += 1;

			summary.addRaw(
				`<b>Status:</b> ${result.isSuccess ? '✅' : '❌'} ${result.title} <br/> Executed command: <code>${command.cmd}</code>`,
				true,
			);
			summary.addCodeBlock(
				`${escapeMd(stdout)}\n\n${escapeMd(stderr)}`,
				'bash',
			);
		}

		await checkRun.update({
			isSuccess: cmdCount.failure === 0,
			title: `${cmdCount.success} passed. ${cmdCount.failure} failed.`,
		});

		summary.addBreak();
	}

	endGroup();
}

// TODO - SHIFT THE BELOW TO SERVER
const CHECKS: {
	check: { name: string };
	commands: CommandType[];
}[] = [
	{
		check: { name: 'Formatting' },
		commands: [
			{
				cmd: 'bun run format',
				interpret({ exitCode }) {
					const isSuccess = exitCode === 0;

					// TODO - Detect Exclusions that have been made and list them as warnings
					let exclusions = 1;
					--exclusions;

					return {
						isSuccess,
						title: isSuccess
							? `Passed ${exclusions !== 0 ? `with ${exclusions} exclusions` : ''}`
							: 'Failed', // stderr.split('\n');
						actions: [
							{
								label: 'Auto Format',
								description: 'Auto Format',
								identifier: 'auto-format',
							},
						],
					};
				},
			},
		],
	},
	{
		check: { name: 'Linting' },
		commands: [
			{
				cmd: 'bun run lint:code',
				interpret({ exitCode }) {
					const isSuccess = exitCode === 0;

					// TODO - Detect Exclusions that have been made and list them as warnings
					let exclusions = 1;
					--exclusions;

					const title = isSuccess
						? `Passed ${exclusions !== 0 ? `with ${exclusions} exclusions` : ''}`
						: 'Failed';

					return { isSuccess, title };
				},
			},
			{
				cmd: 'bun run lint:knip',
				interpret({ stdout }) {
					const isSuccess = stdout.trim() === '# Knip report';

					// TODO - Detect Exclusions that have been made and list them as warnings
					let exclusions = 1;
					--exclusions;

					const title = isSuccess
						? `Passed ${exclusions !== 0 ? `with ${exclusions} exclusions` : ''}`
						: 'Failed';

					return { isSuccess, title };
				},
			},
			{
				cmd: 'bun run lint:cspell',
				interpret({ stderr, exitCode }) {
					const isSuccess = exitCode === 0;

					// TODO - Detect Exclusions that have been made and list them as warnings
					let exclusions = 1;
					--exclusions;

					const logs = stderr?.trim().split(':');

					const title = isSuccess
						? `Passed ${exclusions !== 0 ? `with ${exclusions} exclusions` : ''}`
						: `Failed - Issues ${logs[logs.length - 2].trim()}`;

					return { isSuccess, title };
				},
			},
			{
				cmd: 'bun run lint:md',
				interpret({ exitCode }) {
					const isSuccess = exitCode === 0;

					// TODO - Detect Exclusions that have been made and list them as warnings
					let exclusions = 1;
					--exclusions;

					const title = isSuccess
						? `Passed ${exclusions !== 0 ? `with ${exclusions} exclusions` : ''}`
						: 'Failed';

					return { isSuccess, title };
				},
			},
		],
	},
	// {
	// 	check: { name: 'Code Quality' },
	// 	commands: [
	// 		{
	// 			cmd: 'bun run codeql',
	// 			interpret({ exitCode }) {
	// 				const isSuccess = exitCode === 0;

	// 				return { isSuccess };
	// 			},
	// 		},
	// 	],
	// },
	{
		check: { name: 'Building' },
		commands: [
			{
				cmd: 'bun run build:packages',
				interpret({ exitCode }) {
					const isSuccess = exitCode === 0;
					const title = isSuccess ? 'Passed' : 'Failed';
					return { isSuccess, title };
				},
			},
			// {
			// 	cmd: 'bun run build:www',
			// 	interpret({ exitCode }) {
			// 		const isSuccess = exitCode === 0;
			// 		const title = isSuccess ? 'Passed' : 'Failed';
			// 		return { isSuccess, title };
			// 	},
			// },
		],
	},
] as const;
