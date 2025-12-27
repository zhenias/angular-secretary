import js from "@eslint/js";
import ts from "typescript-eslint";
import angular from "@angular-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  angular.configs.recommended,
  {
    rules: {
      quotes: ["error", "single"],
      semi: ["error", "always"],
    },
    languageOptions: {
      sourceType: 'module', parser: tsParser
    },
    parser: tsParser,
  }
];
