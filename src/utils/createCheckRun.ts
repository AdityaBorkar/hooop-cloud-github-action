import { context, getOctokit } from '@actions/github'

const octokit = getOctokit(process.env.GITHUB_TOKEN || '')

export class CheckRun {
	name: string
	check_run_id?: number

	constructor(props: { name: string }) {
		this.name = props.name
	}

	async create() {
		const check = await octokit.rest.checks.create({
			...context.repo,
			head_sha: context.sha,
			name: this.name,
			status: 'in_progress', // TODO
			details_url: 'https://hooop.cloud', // TODO
		})
		this.check_run_id = check.data.id
	}

	async update(props: {
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

		const { title, summary, text, actions } = props

		return octokit.rest.checks.update({
			...context.repo,
			status: 'completed',
			check_run_id: this.check_run_id,
			output: { title, summary, text },
			actions,
			// output.annotations[].path,
			// output.annotations[].start_line,
			// output.annotations[].end_line,
			// output.annotations[].annotation_level,
			// output.annotations[].message,
			// output.images[].alt,
			// output.images[].image_url,
		})
	}
}
