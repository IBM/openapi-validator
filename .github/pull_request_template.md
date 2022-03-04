## PR summary
<!-- please include a brief summary of the changes in this PR -->


## PR Checklist

### General checklist
Please make sure that your PR fulfills the following requirements:  
- [ ] The commit message follows the [Angular Commit Message Guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines).
- [ ] Tests for the changes have been added (for bug fixes / features)
- [ ] Docs have been added / updated (for bug fixes / features)
- [ ] Dependencies have been updated as needed
- [ ] .secrets.baseline updated as needed?

#### Checklist for adding a new validation rule:
- [ ] Added new validation rule definition (packages/ruleset/src/rules/*.js, index.js)
- [ ] If necessary, added new validation rule implementation (packages/ruleset/src/functions/*.js, updated index.js)
- [ ] Added new rule to default configuration (packages/ruleset/src/ibm-oas.js)
- [ ] Added tests for new rule (packages/ruleset/test/*.test.js)
- [ ] Added docs for new rule (TBD)

#### Checklist for removing an old validation rule:
- [ ] Removed old rule implementation (packages/validator/src/plugins/validation/*.js)
- [ ] Removed or adjusted testcases (packages/validator/test)
- [ ] Updated default configuration to deprecate old rule (packages/validator/src/.defaultsForValidator.js)
- [ ] Removed docs of old rule (TBD)

