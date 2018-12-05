# Code
* Our style is based on [prettier](https://prettier.io/) and the [ESLint](https://eslint.org/) recommended rules, with some minor customizations. This is auto-enforced and can usually be applied by running `npm run fix`.
* Commits _must_ follow the [Angular commit message guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines). We use [semantic-release](https://github.com/semantic-release/semantic-release) to release versions to `npm`, update the changelog, etc. Following these guidelines is simplified by using the [Commitizen CLI](https://github.com/commitizen/cz-cli) with the `cz-conventional-changelog` adapter.

# Issues
* You are welcome to [submit an issue](https://github.com/IBM/openapi-validator/issues) with a bug report or a feature request.
* If you are reporting a bug, please indicate which version of the package you are using and provide steps to reproduce the problem.
* If you are submitting a feature request, please indicate if you are willing or able to submit a PR for it.

# Pull Requests
If you want to contribute to the repository, follow these steps:
1. Fork the repo.
2. Verify that everything is working before you start developing: `npm test`
3. Make your changes. Please follow our style guidelines and leave comments where appropriate. Be sure to update all applicable files [1].
4. Add one or more tests for your changes. Only refactoring, documentation, or build changes require no new tests.
5. Once your tests are passing, commit changes with an [appropriate commit message](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines).
6. Push to your fork and open a pull request. Describe your changes and the motivation for them.

[1] If submitting a new validation, the following files must be updated:
- src/.defaultsForValidator.js
- README.md (description of validation **and** documentation of default value)

