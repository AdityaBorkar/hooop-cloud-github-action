import * as core from '@actions/core'

export async function CodePerformance() {
	core.startGroup('Code Performance')

	core.endGroup()
	return { summary: '', text: '' }
}
