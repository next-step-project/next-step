import ts from '@typed-sigterm/eslint-config';

export default ts({
  ignores: [
    './app/types/database.types.ts',
  ],
}, {
  files: ['./server/**/*'],
  rules: {
    'no-console': [0],
  },
});
