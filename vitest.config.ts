import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['server/**/*.ts', 'mastra/**/*.ts', 'components/**/*.tsx', 'lib/**/*.ts'],
      exclude: ['**/*.test.*', '**/*.spec.*'],
    },
    projects: [
      {
        // サーバーサイド・ユニットテスト
        test: {
          name: 'unit',
          include: ['__tests__/server/**/*.test.ts', '__tests__/mastra/**/*.test.ts'],
          environment: 'node',
        },
        resolve: { alias: { '@': path.resolve(__dirname, '.') } },
      },
      {
        // コンポーネントテスト
        plugins: [react()],
        test: {
          name: 'components',
          globals: true,
          include: ['__tests__/components/**/*.test.tsx'],
          environment: 'jsdom',
          setupFiles: ['__tests__/setup.ts'],
        },
        resolve: { alias: { '@': path.resolve(__dirname, '.') } },
      },
    ],
  },
})
