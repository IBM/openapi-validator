## PR summary
<!-- please include a brief summary of the changes in this PR -->


## PR Checklist

### General checklist
Please make sure that your PR fulfills the following requirements:
- [ ] The commit message follows the [Angular Commit Message Guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines).
- [ ] Tests for the changes have been added (for bug fixes / features)
- [ ] Docs have been added / updated (for bug fixes / features)
- [ ] Dependencies have been updated as needed
- [ ] `.secrets.baseline` has been updated as needed
- [ ] `npm run update-utilities` has been run if any files in `packages/utilities/src` have been updated

#### Checklist for adding a new validation rule:
- [ ] Added new validation rule definition (packages/ruleset/src/rules/*.js, index.js)
- [ ] If necessary, added new validation rule implementation (packages/ruleset/src/functions/*.js, updated index.js)
- [ ] Added new rule to default configuration (packages/ruleset/src/ibm-oas.js)
- [ ] Added tests for new rule (packages/ruleset/test/*.test.js)
- [ ] Added docs for new rule (docs/ibm-cloud-rules.md)
- [ ] Added scoring rubric entry for new rule (packages/validator/src/scoring-tool/rubric.js)
