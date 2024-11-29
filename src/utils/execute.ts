import { exec } from '@actions/exec'

export async function execute(command: string) {
	const [pm, ...args] = command.split(' ')

	let output = ''
	let error = ''
	const exitCode = await exec(pm, args, {
		ignoreReturnCode: true,
		listeners: {
			stdout: (data: Buffer) => {
				output += data.toString()
			},
			stderr: (data: Buffer) => {
				error += data.toString()
			},
		},
	})

	return { exitCode, output, error }
}
