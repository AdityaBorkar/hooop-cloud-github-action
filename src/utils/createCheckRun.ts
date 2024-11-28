import { getState } from '@actions/core';
import { context, getOctokit } from '@actions/github';

const GithubToken = getState('GithubToken');
const octokit = getOctokit(GithubToken);

export class CheckRun {
	name: string;
	check_run_id?: number;

	constructor(props: {
		name: string;
	}) {
		this.name = props.name;
	}

	async create() {
		const check = await octokit.rest.checks.create({
			...context.repo,
			head_sha: context.sha,
			name: this.name,
			status: 'in_progress',
			details_url: 'https://hooop.cloud',
			output: { title: 'All checks passed', summary: '' },
		});
		this.check_run_id = check.data.id;
	}

	async update(props: {
		summary: string;
		text?: string;
	}) {
		if (!this.check_run_id) throw new Error('check_run_id is required');
		return octokit.rest.checks.update({
			...context.repo,
			check_run_id: this.check_run_id,
			head_sha: context.sha,
			name: this.name,
			status: 'completed',
			details_url: 'https://hooop.cloud',
			output: {
				title: 'All checks passed', // IS SHOWN IN THE PR PAGE
				summary: props.summary,
				text: props.text,
				// output.annotations[].path,
				// output.annotations[].start_line,
				// output.annotations[].end_line,
				// output.annotations[].annotation_level,
				// output.annotations[].message,
				// output.images[].alt,
				// output.images[].image_url,
			},
			// actions: [
			// 	{
			// 		label: 'View on GitGuardian',
			// 		description: 'View on GitGuardian',
			// 		identifier: 'gitguardian-view',
			// 	},
			// ],
		});
	}
}
