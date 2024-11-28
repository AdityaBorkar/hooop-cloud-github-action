import * as core from '@actions/core';

export async function PrValidation() {
	core.startGroup('PR Validation');

	// Conventional Commits
	// Linear based checklists
	// ? How to name Branches, PRs and commit messages

	core.endGroup();
	return { summary: '', text: '' };
}
