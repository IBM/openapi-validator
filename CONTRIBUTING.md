# Code
* Our style is based on [prettier](https://prettier.io/) and the [ESLint](https://eslint.org/) recommended rules, with some minor customizations. This is auto-enforced and can usually be applied by running `npm run fix`.
* Commits _must_ follow the [Angular commit message guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines). We use [semantic-release](https://github.com/semantic-release/semantic-release) to release versions to `npm`, update the changelog, etc. Following these guidelines is simplified by using the [Commitizen CLI](https://github.com/commitizen/cz-cli) with the `cz-conventional-changelog` adapter.
* Exported functions _should_ include [JSDoc](https://jsdoc.app) comment headers defining [@param](https://jsdoc.app/tags-param.html) and [@returns](https://jsdoc.app/tags-returns.html) values.

# Issues
* You are welcome to [submit an issue](https://github.com/IBM/openapi-validator/issues) with a bug report or a feature request.
* If you are reporting a bug, please indicate which version of the package you are using and provide steps to reproduce the problem.
* If you are submitting a feature request, please indicate if you are willing or able to submit a PR for it.

# Pull Requests
If you want to contribute to the repository, follow these steps:
1. Fork the repo.
2. Verify that everything is working before you start developing: `npm ci`, then `npm run all`
3. Make your changes. Please follow our style guidelines and leave comments where appropriate. Be sure to update all applicable files.
4. Add one or more tests for your changes. Only refactoring, documentation, or build changes require no new tests.
5. Make sure that the project still builds and tests cleanly: `npm run all`
6. Once your tests are passing, commit changes with an [appropriate commit message](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines).
7. Push to your fork and open a pull request. Describe your changes and the motivation for them.

# Developer's Certificate of Origin 1.1

By making a contribution to this project, I certify that:

(a) The contribution was created in whole or in part by me and I
   have the right to submit it under the open source license
   indicated in the file; or

(b) The contribution is based upon previous work that, to the best
   of my knowledge, is covered under an appropriate open source
   license and I have the right under that license to submit that
   work with modifications, whether created in whole or in part
   by me, under the same open source license (unless I am
   permitted to submit under a different license), as indicated
   in the file; or

(c) The contribution was provided directly to me by some other
   person who certified (a), (b) or (c) and I have not modified
   it.

(d) I understand and agree that this project and the contribution
   are public and that a record of the contribution (including all
   personal information I submit with it, including my sign-off) is
   maintained indefinitely and may be redistributed consistent with
   this project or the open source license(s) involved.

