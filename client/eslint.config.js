// Import the default ESLint configuration for JavaScript
import js from '@eslint/js';

// Import a set of predefined global variables for various environments
import globals from 'globals';

// Import the ESLint plugin for React Hooks to enforce the rules of hooks
import reactHooks from 'eslint-plugin-react-hooks';

// Import the ESLint plugin for React Fast Refresh to ensure compatibility with React's Fast Refresh feature
import reactRefresh from 'eslint-plugin-react-refresh';

// Export the ESLint configuration as an array of objects
export default [
  // Configuration block to define files or directories to ignore
  {
    ignores: ['dist'], // Ignore the 'dist' directory, typically used for build artifacts
  },
  // Main configuration block for JavaScript and JSX files
  {
    // Specify the file patterns this configuration applies to
    files: ['**/*.{js,jsx}'], // Applies to all JavaScript and JSX files in the project

    // Configure language options for modern JavaScript and React
    languageOptions: {
      ecmaVersion: 2020, // Enable ECMAScript 2020 features
      globals: globals.browser, // Use global variables specific to browser environments
      parserOptions: {
        ecmaVersion: 'latest', // Use the latest ECMAScript version for parsing
        ecmaFeatures: { jsx: true }, // Enable parsing of JSX syntax
        sourceType: 'module', // Treat files as ECMAScript modules
      },
    },

    // Define ESLint plugins to extend functionality
    plugins: {
      'react-hooks': reactHooks, // Add linting rules for React Hooks
      'react-refresh': reactRefresh, // Add linting rules for React Fast Refresh
    },

    // Define custom rules to enforce coding standards and best practices
    rules: {
      // Include ESLint's recommended rules for JavaScript
      ...js.configs.recommended.rules,

      // Include the recommended rules for React Hooks
      ...reactHooks.configs.recommended.rules,

      // Disallow unused variables, but allow those matching a specific pattern
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],

      // Warn when non-component code is exported in React,
      // but allow constants to be exported
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
];