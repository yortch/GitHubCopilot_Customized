/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		globals: false,
		environment: 'node',
		coverage: {
			reporter: ['text', 'json', 'html'],
			include: ['src/routes/*.ts'],
			exclude: ['src/routes/*.test.ts'],
			thresholds: {
				statements: 85,
				branches: 80,
				functions: 85,
				lines: 85,
			},
		},
	},
})