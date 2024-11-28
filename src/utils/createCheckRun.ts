import { context, getOctokit } from '@actions/github'

const octokit = getOctokit(process.env.GITHUB_TOKEN || '')

export class CheckRun {
	name: string
	check_run_id?: number

	constructor(props: { name: string }) {
		this.name = props.name
	}

	async create() {
		// await octokit.rest.checks.create({
		// 	...context.repo,
		// 	head_sha: context.sha,
		// 	name: this.name,
		// 	status: 'in_progress', // TODO
		// 	details_url: 'https://hooop.cloud', // TODO
		// });
		// this.check_run_id = check.data.id;
	}

	async update(props: {
		isSuccess: boolean
		title: string
		summary: string
		text?: string
		actions?: {
			label: string
			description: string
			identifier: string
		}[]
	}) {
		if (!this.check_run_id) throw new Error('check_run_id is required')

		const { isSuccess, title, summary, text, actions } = props

		// return octokit.rest.repos.update({
		// 	...context.repo,
		// 	status: 'completed',
		// 	check_run_id: this.check_run_id,
		// 	output: { title, summary, text },
		// 	actions,
		// 	// output.annotations[].path,
		// 	// output.annotations[].start_line,
		// 	// output.annotations[].end_line,
		// 	// output.annotations[].annotation_level,
		// 	// output.annotations[].message,
		// 	// output.images[].alt,
		// 	// output.images[].image_url,
		// });

		// ? WORKAROUND - WE ARE USING COMMIT STATUSES INSTEAD OF CHECK RUNS UNTIL THE APP IS PUBLISHED

		await octokit.rest.repos.createCommitStatus({
			...context.repo,
			sha: context.sha,
			name: this.name,
			state: isSuccess ? 'success' : 'failure',
			description: title,
		})
	}
}
