// @ts-check
import nestConfig from '@repo/eslint-config/nest';

export default [
  { ignores: ['eslint.config.mjs'] },
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
