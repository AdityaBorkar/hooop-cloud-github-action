import * as core from '@actions/core';

export async function Preview() {
	core.startGroup('Preview');

	// # - uses: marocchino/sticky-pull-request-comment@v2
	// #   if: ${{ github.event_name == 'pull_request' }}
	// #   with:
	// #     header: pr-status-checks
	// #     message: |
	// #       ## 🤖 PR Summary ℹ️
	// #       <sup>This comment is automatically generated and will be overwritten every time changes are committed to this branch.</sup>

	// #       ### Workflows

	// #       Workflow Name | Summary
	// #       ------------- | -------
	// #       Next Release Checklist | [Summary](https://github.com/github/docs/actions/runs/${{ github.run_id }}?pr=${{ github.event.pull_request.number }}#summary-${{ github.run_attempt }}})
	// #       Lint Pull Request | [Summary](https://github.com/github/docs/actions/runs/${{ github.run_id }}?pr=${{ github.event.pull_request.number }}#summary-${{ github.run_attempt }}})

	// #       ### Package Changes

	// #       Merging this pull request will trigger the following releases:

	// #       Package Name | Release Version | Release Notes
	// #       ------------- | ------ | ----
	// #       @letsync/core | Build Failed | [Changelog]()
	// #       @letsync/cli | 0.2.0-next.0 | [Changelog]()

	// #       <sup>Version numbers are subject to change until the release is published.</sup>

	// #       ### Documentation Changes

	// #       Preview Link - [...](...)

	// #       Can documentation changes be applied without version release?

	core.endGroup();
	return { summary: '', text: '' };
}

// async function CodeBuilding() {
// 	const pm = getInput('package-manager');

// 	const check = new CheckRun({ name: 'Formatting' });
// 	check.create();

// 	const output = await exec(`${pm} run build:packages --output-style=stream`);

// 	// TODO - Produce an error

// 	const isSuccess = output.includes('All checks passed');
// 	const summary = `Status: ${isSuccess ? 'Success' : 'Failure'}\nScript ran = \`${pm} run all\` (TEXT SM)`;
// 	const text = `\`\`\` ${output} \`\`\``;

// 	check.update({ summary, text });
// 	return { summary, text };
// }
