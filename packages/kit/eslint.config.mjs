// @ts-check
import nestConfig from '@repo/eslint-config/nest';

export default [
  { ignores: ['dist/**', 'tsup.config.ts'] },
  ...nestConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
