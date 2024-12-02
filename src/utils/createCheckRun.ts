import { info } from '@actions/core';
import { context, getOctokit } from '@actions/github';

const octokit = getOctokit(process.env.GITHUB_TOKEN || '');

export async function createCheckRun(check: { name: string }) {
	// const checkRun = await octokit.rest.checks.create({
	// 	...context.repo,
	// 	head_sha: context.sha,
	// 	name: check.name,
	// 	status: 'in_progress', // TODO
	// 	details_url: 'https://hooop.cloud', // TODO
	// });
	// const check_run_id = checkRun.data.id;

	async function update(props: {
		isSuccess: boolean;
		title: string;
		summary?: string;
		text?: string;
		actions?: {
			label: string;
			description: string;
			identifier: string;
		}[];
	}) {
		// if (!this.check_run_id) throw new Error('check_run_id is required')

		const { isSuccess, title, summary, text, actions } = props;

		// return octokit.rest.repos.update({
		// 	...context.repo,
		// 	check_run_id,
		// 	status: 'completed',
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

		const pull_number = Number(context.payload.pull_request?.number);
		if (!pull_number) throw new Error('pull_request.number is required');

		const pr = await octokit.rest.pulls.get({ ...context.repo, pull_number });
		const status = await octokit.rest.repos.createCommitStatus({
			...context.repo,
			sha: pr.data.head.sha,
			name: check.name,
			state: isSuccess ? 'success' : 'failure',
			description: title,
		});

		info(`http: ${status.status}`);
		info(`response: ${JSON.stringify(status, null, 4)}`);
	}

	return { update };
}
