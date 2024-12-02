import { info } from '@actions/core';
import { exec } from '@actions/exec';

export async function execute(command: CommandType) {
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

	info(`stdout: ${stdout}`);
	info(`stderr: ${stderr}`);
	info(`exitCode: ${exitCode}`);

	const result = command.interpret({ stdout, stderr, exitCode });
	return { result, stdout, stderr };
}
