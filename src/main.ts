import { CodePerformance } from './functions/CodePerformance.js'
import { CodeTesting } from './functions/CodeTesting.js'
import { CodeValidation } from './functions/CodeValidation.js'
import { Preview } from './functions/Preview.js'
import { getInput, setFailed, summary } from '@actions/core'

export async function run() {
	try {
		// * Parameters

		const pm = getInput('package-manager', { required: true })
		if (!['bun', 'pnpm', 'npm'].includes(pm))
			throw new Error('We support only bun, pnpm, npm as package managers')

		const GithubToken = process.env.GITHUB_TOKEN
		if (!GithubToken) throw new Error('Github token is required')

		// * Run Functions

		const codeValidation = await CodeValidation()
		const codeTesting = await CodeTesting()
		const codePerformance = await CodePerformance()
		const preview = await Preview()

		// * Job Summary:

		summary.addHeading('Job Summary', '2')
		summary.addList([
			'[Code Validation](#code-validation)',
			'[Code Testing](#code-testing)',
			'[Code Performance](#code-performance)',
			'[Preview](#preview)',
		])

		summary.addBreak()
		summary.addHeading('Code Validation', '2')
		for (const output of codeValidation) {
			summary.addHeading(output.name, '3')
			summary.addRaw(output.summary, true)
			summary.addCodeBlock(output.text, 'bash')
		}

		summary.addBreak()
		summary.addHeading('Code Testing', '2')
		summary.addRaw(codeTesting.summary, true)
		summary.addCodeBlock(codeTesting.text, 'bash')

		summary.addBreak()
		summary.addHeading('Code Performance', '2')
		summary.addRaw(codePerformance.summary, true)
		summary.addCodeBlock(codePerformance.text, 'bash')

		summary.addBreak()
		summary.addHeading('Preview', '2')
		summary.addRaw(preview.summary, true)
		summary.addCodeBlock(preview.text, 'bash')

		summary.write()
	} catch (error: unknown) {
		setFailed(error instanceof Error ? error.message : String(error))
	}
}
