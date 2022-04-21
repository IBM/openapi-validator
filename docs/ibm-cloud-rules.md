# IBM Cloud Validation Ruleset

This document outlines how to configure and use the IBM Cloud Validation Ruleset,
which is delivered in the `@ibm-cloud/openapi-ruleset` NPM package.

## Table of contents

<!--
  The TOC below is generated using the `markdown-toc` node package.

      https://github.com/jonschlinkert/markdown-toc

  You should regenerate the TOC after making changes to this file.

      markdown-toc --maxdepth 4 -i ibm-cloud-rules.md
  -->

<!-- toc -->

- [Ruleset Contents](#ruleset-contents)
  * [Overview of IBM Cloud validation rules](#overview-of-ibm-cloud-validation-rules)
  * [Overview of `spectral:oas` rules](#overview-of-spectraloas-rules)
- [Customization](#customization)
  * [Modify a rule's severity](#modify-a-rules-severity)
  * [Advanced rule customization](#advanced-rule-customization)
  * [Define custom rules](#define-custom-rules)
    + [Replace a rule from `@ibm-cloud/openapi-ruleset`](#replace-a-rule-from-ibm-cloudopenapi-ruleset)
    + [Define a new rule](#define-a-new-rule)
  * [Spectral Overrides](#spectral-overrides)
- [Reference](#reference)
  * [Rule: accept-parameter](#rule-accept-parameter)
  * [Rule: array-of-arrays](#rule-array-of-arrays)
  * [Rule: array-responses](#rule-array-responses)
  * [Rule: authorization-parameter](#rule-authorization-parameter)
  * [Rule: content-entry-contains-schema](#rule-content-entry-contains-schema)
  * [Rule: content-entry-provided](#rule-content-entry-provided)
  * [Rule: content-type-parameter](#rule-content-type-parameter)
  * [Rule: description-mentions-json](#rule-description-mentions-json)
  * [Rule: discriminator](#rule-discriminator)
  * [Rule: enum-case-convention](#rule-enum-case-convention)
  * [Rule: examples-name-contains-space](#rule-examples-name-contains-space)
  * [Rule: ibm-content-type-is-specific](#rule-ibm-content-type-is-specific)
  * [Rule: ibm-error-content-type-is-json](#rule-ibm-error-content-type-is-json)
  * [Rule: ibm-sdk-operations](#rule-ibm-sdk-operations)
  * [Rule: major-version-in-path](#rule-major-version-in-path)
  * [Rule: missing-required-property](#rule-missing-required-property)
  * [Rule: operation-id-case-convention](#rule-operation-id-case-convention)
  * [Rule: operation-id-naming-convention](#rule-operation-id-naming-convention)
  * [Rule: operation-summary](#rule-operation-summary)
  * [Rule: pagination-style](#rule-pagination-style)
  * [Rule: parameter-case-convention](#rule-parameter-case-convention)
  * [Rule: parameter-default](#rule-parameter-default)
  * [Rule: parameter-description](#rule-parameter-description)
  * [Rule: parameter-order](#rule-parameter-order)
  * [Rule: parameter-schema-or-content](#rule-parameter-schema-or-content)
  * [Rule: prohibit-summary-sentence-style](#rule-prohibit-summary-sentence-style)
  * [Rule: property-case-collision](#rule-property-case-collision)
  * [Rule: property-case-convention](#rule-property-case-convention)
  * [Rule: property-description](#rule-property-description)
  * [Rule: property-inconsistent-name-and-type](#rule-property-inconsistent-name-and-type)
  * [Rule: request-body-name](#rule-request-body-name)
  * [Rule: request-body-object](#rule-request-body-object)
  * [Rule: response-error-response-schema](#rule-response-error-response-schema)
  * [Rule: response-example-provided](#rule-response-example-provided)
  * [Rule: schema-description](#rule-schema-description)
  * [Rule: security-schemes](#rule-security-schemes)
  * [Rule: server-variable-default-value](#rule-server-variable-default-value)
  * [Rule: string-boundary](#rule-string-boundary)
  * [Rule: unused-tag](#rule-unused-tag)
  * [Rule: valid-type-format](#rule-valid-type-format)

<!-- tocstop -->

## Ruleset Contents
The IBM Cloud Validation Ruleset consists of:
- IBM Cloud validation rules: a collection of rules that implement and enforce the best practices found
in the [IBM Cloud API Handbook](https://cloud.ibm.com/docs/api-handbook).
- Spectral's [“oas" ruleset](https://meta.stoplight.io/docs/spectral/docs/reference/openapi-rules.md): 
the IBM Cloud Validation Ruleset extends the `spectral:oas` ruleset, so all of the rules contained in
that ruleset are also available to users of the `@ibm-cloud/openapi-ruleset` package as well. 

### Overview of IBM Cloud validation rules
This table provides an overview of the IBM Cloud validation rules.  More detailed information for each rule
is provided in the [Reference](#reference) section below.

<table>
<tr>
<th>Rule Id</th><th>Severity</th><th>Description</th><th>OpenAPI Versions</th>
<tr>
<tr>
<td><a href="#rule-accept-parameter">accept-parameter</a></td>
<td>warn</td>
<td>Operations should not explicitly define the <code>Accept</code> header parameter</td>
<td>oas2, oas3</td>
</tr>
<tr>
<td><a href="#rule-array-of-arrays">array-of-arrays</a></td>
<td>warn</td>
<td>Array schemas with <code>items</code> of type array should be avoided</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#rule-array-responses">array-responses</a></td>
<td>warn</td>
<td>Operations should not return an array as the top-level structure of a response.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#rule-authorization-parameter">authorization-parameter</a></td>
<td>warn</td>
<td>Operations should not explicitly define the <code>Authorization</code> header parameter</td>
<td>oas2, oas3</td>
</tr>
<tr>
<td><a href="#rule-content-entry-contains-schema">content-entry-contains-schema</a></td>
<td>warn</td>
<td>Content entries must specify a schema</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#rule-content-entry-provided">content-entry-provided</a></td>
<td>warn</td>
<td>Request bodies and non-204 responses should define a content field</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#rule-content-type-parameter">content-type-parameter</a></td>
<td>warn</td>
<td>Operations should not explicitly define the <code>Content-Type</code> header parameter</td>
<td>oas2, oas3</td>
</tr>
<tr>
<td><a href="#rule-description-mentions-json">description-mentions-json</a></td>
<td>warn</td>
<td>Schema descriptions should avoid mentioning <code>JSON</code></td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#rule-discriminator">discriminator</a></td>
<td>error</td>
<td>The discriminator property must be defined in the schema</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#rule-duplicate-path-parameter">discriminator</a></td>
<td>error</td>
<td>Common path parameters should be defined on the path object.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#rule-enum-case-convention">enum-case-convention</a></td>
<td>error</td>
<td>Enum values should follow a specific case convention</td>
<td>oas2, oas3</td>
</tr>
<tr>
<td><a href="#rule-examples-name-contains-space">examples-name-contains-space</a></td>
<td>warn</td>
<td>The name of an entry in an <code>examples</code> field should not contain a space</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#rule-ibm-content-type-is-specific">ibm-content-type-is-specific</a></td>
<td>warn</td>
<td><code>*/*</code> should only be used when all content types are supported</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#rule-ibm-error-content-type-is-json">ibm-error-content-type-is-json</a></td>
<td>warn</td>
<td>Error response should support <code>application/json</code></td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#rule-ibm-sdk-operations">ibm-sdk-operations</a></td>
<td>warn</td>
<td>Validates the structure of the <code>x-sdk-operations</code> object </td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#rule-major-version-in-path">major-version-in-path</a></td>
<td>warn</td>
<td>All paths must contain the API major version as a distinct path segment</td>
<td>oas2, oas3</td>
</tr>
<tr>
<td><a href="#rule-missing-required-property">missing-required-property</a></td>
<td>error</td>
<td>A schema property defined as <code>required</code> must be defined within the schema</td>
<td>oas2, oas3</td>
</tr>
<tr>
<td><a href="#rule-operation-id-case-convention">operation-id-case-convention</a></td>
<td>warn</td>
<td>Operation ids should follow a specific case convention</td>
<td>oas2, oas3</td>
</tr>
<tr>
<td><a href="#rule-operation-id-naming-convention">operation-id-naming-convention</a></td>
<td>warn</td>
<td>Operation ids should follow a naming convention</td>
<td>oas2, oas3</td>
</tr>
<tr>
<td><a href="#rule-operation-summary">operation-summary</a></td>
<td>warn</td>
<td>Operation <code>summary</code> must be present and non-empty string.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#rule-pagination-style">pagination-style</a></td>
<td>warn</td>
<td>List operations should have correct pagination style</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#rule-parameter-case-convention">parameter-case-convention</a></td>
<td>error</td>
<td>Parameter names should follow a specific case convention</td>
<td>oas2, oas3</td>
</tr>
<tr>
<td><a href="#rule-parameter-default">parameter-default</a></td>
<td>warn</td>
<td>Required parameters should not define a default value</td>
<td>oas2, oas3</td>
</tr>
<tr>
<td><a href="#rule-parameter-description">parameter-description</a></td>
<td>warn</td>
<td>Parameters should have a non-empty description</td>
<td>oas2, oas3</td>
</tr>
<tr>
<td><a href="#rule-parameter-order">parameter-order</a></td>
<td>warn</td>
<td>All required operation parameters should be listed before optional parameters.</td>
<td>oas2, oas3</td>
</tr>
<tr>
<td><a href="#rule-parameter-schema-or-content">parameter-schema-or-content</a></td>
<td>error</td>
<td>Parameters must provide either a schema or content</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#rule-prohibit-summary-sentence-style">prohibit-summary-sentence-style</a></td>
<td>warn</td>
<td>An operation's <code>summary</code> field should not have a trailing period</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#rule-property-case-collision">property-case-collision</a></td>
<td>error</td>
<td>Avoid duplicate property names within a schema, even if they differ by case convention</td>
<td>oas2, oas3</td>
</tr>
<tr>
<td><a href="#rule-property-case-convention">property-case-convention</a></td>
<td>error</td>
<td>Schema property names should follow a specific case convention</td>
<td>oas2, oas3</td>
</tr>
<tr>
<td><a href="#rule-property-description">property-description</a></td>
<td>warn</td>
<td>Schema properties should have a non-empty description</td>
<td>oas2, oas3</td>
</tr>
<tr>
<td><a href="#rule-property-inconsistent-name-and-type">property-inconsistent-name-and-type</a></td>
<td>warn</td>
<td>Avoid using the same property name for properties of different types.</td>
<td>oas2, oas3</td>
</tr>
<tr>
<td><a href="#rule-request-body-name">request-body-name</a></td>
<td>warn</td>
<td>An operation should specify a request body name (with the <code>x-codegen-request-body-name</code> extension) if its requestBody
has non-form content.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#rule-request-body-object">request-body-object</a></td>
<td>warn</td>
<td>A request body should be defined as an object</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#rule-response-error-response-schema">response-error-response-schema</a></td>
<td>warn</td>
<td>Error response should follow API Handbook guidelines</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#rule-response-example-provided">response-example-provided</a></td>
<td>warn</td>
<td>Response should provide an example</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#rule-schema-description">schema-description</a></td>
<td>warn</td>
<td>Schemas should have a non-empty description</td>
<td>oas2, oas3</td>
</tr>
<tr>
<td><a href="#rule-security-schemes">security-schemes</a></td>
<td>warn</td>
<td>Verifies the security schemes and security requirement objects</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#rule-server-variable-default-value">server-variable-default-value</a></td>
<td>warn</td>
<td>Server variables should have a default value</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#rule-string-boundary">string-boundary</a></td>
<td>warn</td>
<td>String schema properties should define the <code>pattern</code>, <code>minLength</code> and <code>maxLength</code> fields</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#rule-unused-tag">unused-tag</a></td>
<td>warn</td>
<td>Verifies that each defined tag is referenced by at least one operation</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#rule-valid-type-format">valid-type-format</a></td>
<td>error</td>
<td>Schema must use a valid combination of <code>type</code> and <code>format</code></td>
<td>oas3</td>
</tr>
</table>


### Overview of `spectral:oas` rules
As mentioned above, the IBM Cloud Validation Ruleset (`@ibm-cloud/openapi-ruleset`) extends
the `spectral:oas` ruleset.  
While all of the `spectral:oas` rules are included, only the following rules are enabled by default:
```
oas2-operation-formData-consume-check: true
operation-operationId-unique: true
operation-parameters: true
operation-tag-defined: true
no-eval-in-markdown: true
no-script-tags-in-markdown: true
openapi-tags: true
operation-description: true
operation-tags: true
path-params
path-declarations-must-exist
path-keys-no-trailing-slash: true
path-not-include-query: true
typed-enum: true
oas2-api-host: true
oas2-api-schemes: true
oas2-host-trailing-slash: true
oas2-valid-schema-example: 'warn'
oas2-anyOf: true
oas2-oneOf: true
oas2-unused-definition: true
oas3-api-servers: true
oas3-examples-value-or-externalValue: true
oas3-server-trailing-slash: true
oas3-valid-media-example: 'warn'
oas3-valid-schema-example: 'warn'
oas3-schema: true
oas3-unused-component: true
```

## Customization
You can customize any of the rules contained in the `@ibm-cloud/openapi-ruleset`
(including the rules in the `spectral:oas` ruleset) by creating a custom ruleset.
For detailed information on creating your own ruleset and how to extend other rulesets, please read
the [Spectral Rulesets](https://meta.stoplight.io/docs/spectral/ZG9jOjYyMDc0NA-rulesets) documentation.

There are two different ways that you can supply your custom ruleset file to the IBM OpenAPI Validator:
1. Name your custom ruleset file with one of the names (`.spectral.yaml`, `.spectral.yml`, `.spectral.json` or `.spectral.js`)
and place it in the current directory where you will be running the validator.
2. Use an arbitrary filename for your custom ruleset file (e.g. `/User/myuser/rules/my-rules.yaml`) and use
the `--ruleset` command line option to specify the name when running the validator.
Example:
```
    lint-openapi --ruleset /User/myuser/rules/my-rules.yaml my-service-api.yaml
```

In this document, we'll focus on how to customize and extend the rules found in the IBM Cloud Validation Ruleset.

There are a few different ways in which you can customize and extend rules.  The customization options available to you
will depend on the type of customization that you need to do.  This is described in the following sections.

**Note:** If you extend the `@ibm-cloud/openapi-ruleset` package in your custom ruleset file,
you MUST install the npm package first, using a command like this:
```
npm install @ibm-cloud/openapi-ruleset
```

### Modify a rule's severity

If you would simply like to modify a rule's severity or disable a rule altogether,
follow the instructions in this section.

Any rule in the `@ibm-cloud/openapi-ruleset` package can be configured to trigger an error, warning, info,
or hint message in the validator output.  
For example, to configure the `schema-description` rule to trigger an `info` message instead of a `warning`,
specify the following in your custom ruleset file (this example uses the yaml format):
```yaml
extends: '@ibm-cloud/openapi-ruleset'
rules:
  schema-description: info
```

To completely disable a rule, use the severity of `off`.
For example, to disable the `schema-description` rule, specify the following in your custom ruleset file:
```yaml
extends: '@ibm-cloud/openapi-ruleset'
rules:
  schema-description: off
```

Since the `@ibm-cloud/openapi-ruleset` package includes all the rules in `spectral:oas`, you can also enable rules from that
ruleset that are disabled by default.
For example, to enable the `info-contact` rule with its default severity (`warning`), specify the following in your custom ruleset file:
```yaml
extends: '@ibm-cloud/openapi-ruleset'
rules:
  info-contact: true
```

You could also set the severity of `info-contact` explicitly to `error`, `warn`, `info`, or `hint`.

### Advanced rule customization

You can customize more than just a rule's severity.  You can also customize a rule's configuration to select non-default
options, etc.  Not all rules support a configuration, but some do (for details about which rules support a configuration object,
please see the [Reference](#reference) section below).

In order to customize the configuration of a rule, you will need to re-define the entire rule within your custom ruleset.
For these types of customizations, please follow the instructions in the [Custom Rules](#custom-rules) section below.

### Define custom rules

If you would like to modify the configuration of an existing rule or define your own new rule, you can define custom rules
within your own ruleset. 

For reference information on how to define your own custom rules, please read the
[Spectral custom rulesets](https://meta.stoplight.io/docs/spectral/ZG9jOjI1MTg5-custom-rulesets) documentation.

#### Replace a rule from `@ibm-cloud/openapi-ruleset`
In this section, we'll focus on the goal of defining a new custom rule that replaces the `property-case-convention` rule
within the `@ibm-cloud/openapi-ruleset` package.
Specifically, we'll configure our custom rule to enforce camel case within schema property names rather than the default snake case.

In this scenario, we will re-define the `property-case-convention` rule within our custom ruleset, but we will re-use the
`propertyCaseConvention` custom function within the `@ibm-cloud/openapi-ruleset` package that implements the logic of this rule.
For this reason, we must implement our custom ruleset using javascript instead of yaml.

Here is our custom ruleset file (`.spectral.js`):

```javascript
const ibmCloudValidationRules = require('@ibm-cloud/openapi-ruleset');                           // Note 1
const { propertyCaseConvention } = require('@ibm-cloud/openapi-ruleset/src/functions');
const { schemas } = require('@ibm-cloud/openapi-ruleset/src/collections');

module.exports = {
  extends: ibmCloudValidationRules,
  rules: {
    'property-case-convention': {                                                                // Note 2
      description: 'Property names must follow camel case',
      message: '{{error}}',
      resolved: true,                                                                            // Note 3
      given: schemas,                                                                            // Note 4
      severity: 'warn',
      then: {
        function: propertyCaseConvention,                                                        // Note 5
        functionOptions: {                                                                       // Note 6
          type: 'camel'
        }
      }
    }
  }
};
```
Notes:
1. This custom ruleset extends `@ibm-cloud/openapi-ruleset` and also references the `propertyCaseConvention` function and the
`schemas` JSONPath collection, so we need to import each of these with `require` statements.  In addition, be sure to install
the `@ibm-cloud/openapi-ruleset` package: `npm install @ibm-cloud/openapi-ruleset`.
2. This custom rule is re-defining (overriding) the `property-case-convention` rule from the `@ibm-cloud/openapi-ruleset` package
so we need to use the same rule id (`property-case-convention`).  Alternatively, we could have used a different rule id of our choosing,
but we would then need to separately disable the existing `property-case-convention` rule so that we don't end up using both rules which would result in
the simultaneous enforcement of two competing case conventions.
3. The `resolved=true` setting means that the rule will be invoked on the _resolved_ version of the API definition (i.e. each `$ref`
will be resolved by replacing with the referenced entity).
4. The use of the `schemas` collection for the value of the `given` field is a convenient way to express that the rule should be invoked
on each location within the _resolved_ API definition where a schema might appear.
5. Our custom rule uses the same function (`propertyCaseConvention`) that is used by the original `property-case-convention` rule
within the `@ibm-cloud/openapi-ruleset` package.
6. We set the `functionOptions` field to configure the rule to enforce camel case instead of the default snake case.

#### Define a new rule
To define a new rule as part of your custom ruleset, please read the [Spectral Custom Rulesets](https://meta.stoplight.io/docs/spectral/ZG9jOjI1MTg5-custom-rulesets) documentation.


### Spectral Overrides

Rather than turning off a Spectral rule entirely, Spectral overrides allow you to customize ruleset usage for different
files and projects without having to duplicate any rules.
For details on how to add overrides to your custom ruleset, please read the
[Spectral overrides](https://meta.stoplight.io/docs/spectral/ZG9jOjI1MTg5-custom-rulesets#overrides) documentation.


## Reference
This section provides reference documentation about the IBM Cloud Validation Rules contained
in the `@ibm-cloud/openapi-ruleset` package.

### Rule: accept-parameter
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>accept-parameter</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Operations should not explicitly define the <code>Accept</code> header parameter.
Instead, the value of the <code>Accept</code> parameter is inferred from the <code>responses</code> field.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas2, oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things':
    get:
      operationId: list_things
      parameters:
        - name: Accept
          in: header
          description: The expected content type within the response.
          schema:
            type: string
      responses:
        '200':
          description: 'Success response!'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ThingCollection'
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things':
    get:
      operationId: list_things
      responses:
        '200':
          description: 'Success response!'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ThingCollection'

</pre>
</td>
</tr>
</table>


### Rule: array-of-arrays
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>array-of-arrays</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Array schemas with items of type array should be avoided</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
requestBody:
  content:
    application/json:
      schema:
        type: array
        items:
          type: array
          items:
            type: string
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
requestBody:
  content:
    application/json:
      schema:
        type: array
        items:
          type: string
</pre>
</td>
</tr>
</table>


### Rule: array-responses
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>array-responses</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule checks to make sure that operations do not define an array as the top-level structure within a response.
The recommendation is to instead use an object with a property that contains the array.
This will allow you to expand the definition of the response body (e.g. add new properties) in a compatible way
in the future if needed.
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/things':
    get:
      operationId: list_things
      responses:
        '200':
          content:
            schema:
              type: array
              items:
                $ref: '#/components/schemas/Thing'

sample response body:
[ {"name": "thing-1"}, {"name": "thing-2"} ]
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things':
    get:
      operationId: list_things
      responses:
        '200':
          content:
            schema:
              type: object
              properties:
                things:
                  type: array
                  items:
                    $ref: '#/components/schemas/Thing'

sample response body:
{"things": [ {"name": "thing-1"}, {"name": "thing-2"} ]}
</pre>
</pre>
</td>
</tr>
</table>


### Rule: authorization-parameter
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>authorization-parameter</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Operations should not explicitly define the <code>Authorization</code> header parameter.
Instead, the <code>security</code> object should be used to indicate the supported authentication
mechanisms.
The <code>security</code> object can be defined at an operation level (which would apply only to
that operation) or at a global level within the API definition (which would apply to all operations).
<p>Within generated SDKs, the <code>Authorization</code> header will be managed automatically by the
built-in authenticator support.
<p>Non-SDK users (those using <code>curl</code>, for example) can infer
the use of the Authorization header from the <code>security</code> object in the API definition
together with other documentation provided for the service.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas2, oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/things':
    get:
      operationId: list_things
      parameters:
        - name: Authorization
          in: header
          description: The IAM access token in the form of a Bearer token.
          schema:
            type: string
            pattern: '^Bearer .*$'
      responses:
        '200':
          description: 'Success response!'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ThingCollection'
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
security:
  - IAM: []
components:
  securitySchemes:
    IAM:
      description: Service supports normal IAM-based authentication/authorization.
      in: header
      name: Authorization
      type: apiKey
paths:
  '/v1/things':
    get:
      operationId: list_things
      responses:
        '200':
          description: 'Success response!'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ThingCollection'

</pre>
</td>
</tr>
</table>


### Rule: content-entry-contains-schema
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>content-entry-contains-schema</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Each request body and response <code>content</code> field should contain a schema.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
responses:
  200:
    description: 'Success response!'
    content:
      application/json:
        # schema not provided
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
responses:
  200:
    description: 'Success response!'
    content:
      application/json:
        schema:
          type: string
</pre>
</td>
</tr>
</table>


### Rule: content-entry-provided
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>content-entry-provided</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Each request body and non-204 response should have a <code>content</code> field.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
responses:
  200:
    description: 'Success response!'
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
responses:
  200:
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/Thing'
</pre>
</td>
</tr>
</table>


### Rule: content-type-parameter
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>content-type-parameter</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Operations should not explicitly define the <code>Content-Type</code> header parameter.
Instead, the value of the <code>Content-Type</code> parameter is inferred from the <code>requestBody</code> field.
Note that the <code>Content-Type</code> header parameter is managed automatically by generated SDKs.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas2, oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/things':
    post:
      operationId: create_thing
      parameters:
        - name: Content-Type
          in: header
          description: The content type of the request body.
          schema:
            type: string
      requestBody:
          description: 'The new Thing instance'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Thing'
      responses:
        '201':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Thing'
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things':
    post:
      operationId: create_thing
      requestBody:
          description: 'The new Thing instance'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Thing'
      responses:
        '201':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Thing'
</pre>
</td>
</tr>
</table>


### Rule: description-mentions-json
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>description-mentions-json</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Schema and schema property descriptions should avoid mentioning <code>JSON</code>.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      description: A JSON object representing a Thing instance.
      type: object
      properties:
        thing_type:
          type: string
        thing_version:
          type: string
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      description: An object representing a Thing resource.
      type: object
      properties:
        thing_type:
          type: string
        thing_version:
          type: string
</pre>
</td>
</tr>
</table>


### Rule: discriminator
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>discriminator</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule is used in conjunction with Spectral's <code>oas3-schema</code> rule to verify that a
<code>discriminator</code> object (if present) is defined properly within a schema.
This includes the following validations:
<ol>
<li>The <code>discriminator</code> field must be an object.</li>
<li>The <code>discriminator</code> object must have a field named <code>propertyName</code> that defines the name of the discriminator property.</li>
<li>The <code>propertyName</code> field must be of type string.</li>
<li>The schema property whose name is specified with the <code>propertyName</code> field must exist within the schema.</li>
</ol>
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>error</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  schema:
    Thing:
      description: A Thing instance.
      type: object
      properties:
        thing_id:
          type: string
        thing_version:
          type: string
      discriminator:
        propertyName: thing_type
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  schema:
    Thing:
      description: A Thing instance.
      type: object
      properties:
        thing_type:
          type: string
        thing_id:
          type: string
        thing_version:
          type: string
      discriminator:
        propertyName: thing_type
</pre>
</td>
</tr>
</table>


### Rule: duplicate-path-parameter
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>duplicate-path-parameter</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>When defining a path parameter, it's a good practice to define it once in the path object's `parameters` field rather than
defining it separately within each of the operations that exist for that path.
<p>This rule checks for situations in which a path parameter is defined identically within multiple operations under a given path,
and returns a warning to alert the user that the path parameter should be defined on the path object instead.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas2, oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/things/{thing_id}':
    get:
      operationId: get_thing
      parameters:
        - name: thing_id
          in: path
          description: The id of the thing instance.
          schema:
            type: string
    delete:
      operationId: delete_thing
      parameters:
        - name: thing_id
          in: path
          description: The id of the thing instance.
          schema:
            type: string
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things/{thing_id}':
    parameters:
      - name: thing_id
        in: path
        description: The id of the thing instance.
        schema:
          type: string
    get:
      operationId: get_thing
    delete:
      operationId: delete_thing
</pre>
</td>
</tr>
</table>


### Rule: enum-case-convention
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>enum-case-convention</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule verifies that <code>enum</code> fields specified for string-type schema properties
contain values that follow a specific case convention, with the default being snake case.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>error</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas2, oas3</td>
</tr>
<tr>
<td valign=top><b>Configuration:</b></td>
<td>This rule can be configured to enforce a specific case convention for enum values.
To configure the rule, set the <code>functionOptions</code> field within the rule definition to be an object
that is the appropriate configuration to be used by Spectral's <code>casing()</code> function
[<a href="https://meta.stoplight.io/docs/spectral/ZG9jOjExNg-core-functions#casing">1</a>]
to enforce the desired case convention for enum values.
<p>The default configuration object provided in the rule definition is:
<pre>
{
  type: 'snake'
}
</pre>
<p>To enforce a different case convention for enum values, you'll need to
<a href="#replace-a-rule-from-ibm-cloudopenapi-ruleset">replace this rule with a new rule within your
custom ruleset</a> and modify the configuration such that the value of the <code>type</code> field 
specifies the desired case convention.
For example, to enforce camel case for enum values, the configuration object would look like this:
<pre>
{
  type: 'camel'
}
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  schemas:
    ThingType:
      type: string
      enum:
        - thingType1
        - thingType2
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  schemas:
    ThingType:
      type: string
      enum:
        - thing_type_1
        - thing_type_2
</pre>
</td>
</tr>
</table>


### Rule: examples-name-contains-space
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>examples-name-contains-space</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>The name of an entry in an <code>examples</code> field should not contain a space.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  /v1/things:
    post:
      operationId: create_thing
      description: Create a new Thing instance.
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Thing'
            examples:
              'Create Thing Example':
                value:
                  thing_id: 1ac38d2z89
                  thing_type: type1
      responses:
        ...
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  /v1/things:
    post:
      operationId: create_thing
      description: Create a new Thing instance.
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Thing'
            examples:
              CreateThingExample:
                value:
                  thing_id: 1ac38d2z89
                  thing_type: type1
      responses:
        ...
</pre>
</td>
</tr>
</table>


### Rule: ibm-content-type-is-specific
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-content-type-is-specific</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>The use of <code>*/*</code> as a mimetype within a <code>content</code> field should be avoided
unless the API actually supports all content types.
<p>If the API in fact supports all content types, this warning should be ignored.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
requestBody:
  content:
    '*/*':
      ...
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
requestBody:
  content:
    'application/json':
      ...
    'text/plain':
      ...
</pre>
</td>
</tr>
</table>


### Rule: ibm-error-content-type-is-json
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-error-content-type-is-json</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>An error response likely returns <code>application/json</code> content and this rule warns when <code>application/json</code> 
is not the content mimetype.
This rule should be ignored when the API actually returns an error response that is not <code>application/json</code>.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
responses:
  400:
    content:
      'application/octet-stream':
        ...
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
responses:
  400:
    content:
      'application/json':
        ...
</pre>
</td>
</tr>
</table>


### Rule: ibm-sdk-operations
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-sdk-operations</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule validates the structure of values specified for the <code>x-sdk-operations</code>
extension, using <a href="/packages/ruleset/src/schemas/x-sdk-operations.json">this JSON Schema document</a>.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
n/a
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
n/a
</td>
</tr>
</table>


### Rule: major-version-in-path
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>major-version-in-path</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Each path defined within the API definition should include a path segment for the API major version,
of the form <code>v&lt;n&gt;</code>, and all paths should have the same API major version segment.
The API major version can appear in either the server URL (oas3), the basePath (oas2), or in each path entry.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas2, oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
openapi: 3.0.1
info:
  version: 1.0.0
  ...
paths:
  /things:
    ,,,
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
openapi: 3.0.1
info:
  version: 1.0.0
  ...
paths:
  /v1/things:
    ,,,
</pre>
</td>
</tr>
</table>


### Rule: missing-required-property
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>missing-required-property</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule verifies that for each property name included in a schema's <code>required</code> list, 
that property must be defined within the schema.
The property could be defined in any of the following ways:
<ol>
<li>within the schema's <code>properties</code> field</li>
<li>within <b>one or more</b> of the schemas listed in the <code>allOf</code> field</li>
<li>within <b>each</b> of the schemas listed in the <code>anyOf</code> or <code>oneOf</code> field</li>
</ol>
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>error</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas2, oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      type: object
      properties:
        thing_id:
          type: string
      required:
        - thing_id
        - thing_version
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      type: object
      properties:
        thing_id:
          type: string
        thing_version:
          type: string
      required:
        - thing_id
        - thing_version
</pre>
</td>
</tr>
</table>


### Rule: operation-id-case-convention
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>operation-id-case-convention</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Operation ids should follow a specific case convention, with the default being snake case.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas2, oas3</td>
</tr>
<tr>
<td valign=top><b>Configuration:</b></td>
<td>This rule can be configured to enforce a specific case convention for <code>operationId</code> values.
To configure the rule, set the <code>functionOptions</code> field within the rule definition to be an object
that is the appropriate configuration to be used by Spectral's <code>casing()</code> function
[<a href="https://meta.stoplight.io/docs/spectral/ZG9jOjExNg-core-functions#casing">1</a>]
to enforce the desired case convention for <code>operationId</code> values.
<p>The default configuration object provided in the rule definition is:
<pre>
{
  type: 'snake'
}
</pre>
<p>To enforce a different case convention for <code>operationId</code> values, you'll need to
<a href="#replace-a-rule-from-ibm-cloudopenapi-ruleset">replace this rule with a new rule within your
custom ruleset</a> and modify the configuration such that the value of the <code>type</code> field 
specifies the desired case convention.
For example, to enforce camel case for operation ids, the configuration object would look like this:
<pre>
{
  type: 'camel'
}
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/things':
    post:
      operationId: createThing
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things':
    post:
      operationId: create_thing
</pre>
</td>
</tr>
</table>


### Rule: operation-id-naming-convention
<table>
<tr>
<td><b>Rule id:</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Operation ids should follow a naming convention using standard, predictable verbs.
For example, <code>create_thing</code> would be preferred over <code>manufacture_thing</code>
when deciding on an operationId for the <code>POST /v1/things</code> operation.
Likewise, for the <code>GET /v1/things/{thing_id}</code> operation, we might prefer
<code>get_thing</code> over <code>retrieve_thing</code> for the operationId.
<p>This rule will analyze the operations, looking for operationId values that are not using the recommended verbs.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas2, oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/things':
    post:
      operationId: manufacture_thing
      description: Create a new Thing instance.
      summary: Create a Thing
  '/v1/things/{thing_id}':
    get:
      operationId: retrieve_thing
      description: Get a Thing instance.
      summary: Get a Thing
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things':
    post:
      operationId: create_thing
      description: Create a new Thing instance.
      summary: Create a Thing
  '/v1/things/{thing_id}':
    get:
      operationId: get_thing
      description: Get a Thing instance.
      summary: Get a Thing
</pre>
</td>
</tr>
</table>


### Rule: operation-summary
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>operation-summary</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule verifies that each operation has a non-empty summary.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/things':
    post:
      operationId: create_thing
      description: Create a new Thing instance.
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things':
    get:
      operationId: create_thing
      description: Create a new Thing instance.
      summary: Create a Thing
</pre>
</td>
</tr>
</table>


### Rule: pagination-style
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>pagination-style</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule verifies that list-type operations implement pagination correctly per the guidelines in the 
<a href="https://cloud.ibm.com/docs/api-handbook">API Handbook</a>.
<p>An operation is recognized as a <i>paginated</i> list-type operation if all of the following are true:
<ul>
<li>The path doesn't end in a path segment that is a path parameter reference
(e.g. <code>/v1/things</code> vs <code>/v1/things/{thing_id}</code>).</li>
<li>The operation is a <b>get</b>.</li>
<li>The operation's response schema is an object containing an array property.</li>
<li>The operation defines either the <code>offset</code> query parameter or a page-token type
query parameter whose name is one of the following: <code>start</code>(preferred), 
<code>token</code>, <code>cursor</code>, <code>page</code>, or <code>page_token</code>.</li>
</ul>
<p>If an operation is recognized as a paginated list-type operation, then the following checks are
performed:
<ul>
<li>If the operation has a <code>limit</code> query parameter, then it must be of type <code>integer</code>,
optional, and have default and maximum values defined for it [<a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#limit-with-page-token">1</a>,
<a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#limit-with-offset">2</a>].
</li>
<li>If the operation has an <code>offset</code> query parameter, then it must be of type <code>integer</code> and
optional [<a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#offset">3</a>].
</li>
<li>If the operation has an <code>offset</code> query parameter, then it must also have a <code>limit</code>
query parameter [<a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#offset-and-limit-pagination">4</a>].
This is because the presence of the <code>offset</code> parameter indicates that the <i>offset/limit</i> style pagination is being used.
</li>
<li>If the operation has a <i>page-token</i> type query parameter, then it must be of type <code>string</code>
and optional, and its name should be <code>start</code> [<a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#token-based-pagination">5</a>].
</li>
<li>If the operation has a <code>limit</code> query parameter, then the response body schema must 
contain a <code>limit</code> schema property that is of type <code>integer</code> and required
[<a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#additional-response-fields-with-token">6</a>,
<a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#additional-response-fields-with-offset">7</a>].
</li>
<li>If the operation has an <code>offset</code> query parameter, then the response body schema must 
contain an <code>offset</code> schema property that is of type <code>integer</code> and required
[<a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#additional-response-fields-with-offset">8</a>].
</li>
<li>If the operation's response body schema contains a <code>total_count</code> property, then it must 
be of type <code>integer</code> and required
[<a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#additional-response-fields-with-token">9</a>,
<a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#additional-response-fields-with-offset">10</a>].
</li>
<li>The operation's response body schema should contain properties named
<code>first</code>, <code>last</code>, <code>previous</code> and <code>next</code> that provide links to the first, last,
previous and next page of results, respectively.
Each of these properties should be defined as an object with a property named <code>href</code>
of type <code>string</code> which contains the appropriate request URL string to be used to obtain
that page of results [<a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#pagination-links">11</a>].
</li>
</ul>
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
n/a
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
n/a
</td>
</tr>
</table>


### Rule: parameter-case-convention
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>parameter-case-convention</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Parameter names should be snake case</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>error</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas2, oas3</td>
</tr>
<tr>
<td valign=top><b>Configuration:</b></td>
<td>This rule can be configured to enforce specific case conventions for each parameter type.
To configure the rule, set the <code>functionOptions</code> field within the rule definition to be an object
with keys that represent the different parameter types to be checked for proper case conventions
('query', 'path', and 'header').  The value associated with each entry should be an object that is the
appropriate configuration to be used by Spectral's <code>casing()</code> function
[<a href="https://meta.stoplight.io/docs/spectral/ZG9jOjExNg-core-functions#casing">1</a>]
to enforce the desired case convention for that parameter type.
<p>The default configuration object provided in the rule definition is:
<pre>
{
  query: {
    type: 'snake',
    separator: {
      char: '.'
    }
  },
  path: {
    type: 'snake'
  },
  header: {
    type: 'pascal',
    separator: {
      char: '-'
    }
  }
}
</pre>
This enforces:
<ul>
<li>Query parameter names to be snake case, while also allowing "." within the name</li>
<li>Path parameter names to be snake case</li>
<li>Header parameter names to be in http header canonical form, which amounts to
<code>pascal</code> casing with a hyphen (<code>"-"</code>) separating the words
(e.g. <code>X-My-Header</code>).
</li>
</ul>
<p>To disable the case convention checks for a particular parameter type, simply remove
the entry for that parameter type from the configuration object.  
<p>If you want to use a different configuration for this rule other than the default configuration
mentioned above, you'll need to
<a href="#replace-a-rule-from-ibm-cloudopenapi-ruleset">replace this rule with a new rule within your
custom ruleset</a> and modify the configuration appropriately for your needs.
For example, to disable the case convention checks on header parameter names, while enforcing camel case conventions
on query and path parameter names, the configuration object would look like this:
<pre>
{
  query: {
    type: 'camel'
  },
  path: {
    type: 'camel'
  }
}
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  parameters:
    SortOrderParam:
      name: sortOrder           &lt;&lt; camel case
      description: The sort order.
      in: query
      required: false
      schema:
        type: string
        enum:
          - asc
          - desc
        default: asc
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  parameters:
    SortOrderParam:
      name: sort_order        &lt;&lt; snake case
      description: The sort order.
      in: query
      required: false
      schema:
        type: string
        enum:
          - asc
          - desc
        default: asc
</pre>
</td>
</tr>
</table>


### Rule: parameter-default
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>parameter-default</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Required parameters should not define a default value.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas2, oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  parameters:
    SortOrderParam:
      name: sort_order
      description: The sort order.
      in: query
      required: true
      schema:
        type: string
        enum:
          - asc
          - desc
        default: asc
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  parameters:
    SortOrderParam:
      name: sort_order
      description: The sort order.
      in: query
      required: true
      schema:
        type: string
        enum:
          - asc
          - desc
</pre>
</td>
</tr>
</table>


### Rule: parameter-description
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>parameter-description</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Parameters should have a non-empty description.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas2, oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  parameters:
    SortOrderParam:
      name: sort_order
      in: query
      required: false
      schema:
        type: string
        enum:
          - asc
          - desc
        default: asc
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  parameters:
    SortOrderParam:
      name: sort_order
      description: An optional ordering to be performed on the results that are returned.
      in: query
      required: false
      schema:
        type: string
        enum:
          - asc
          - desc
        default: asc
</pre>
</td>
</tr>
</table>


### Rule: parameter-order
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>parameter-order</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>It is a good practice to list the parameters within an operation such that all required parameters are
listed first, then any optional parameters.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas2, oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/things':
    get:
      operationId: list_things
      description: List the set of Things.
      summary: List Things
      parameters:
        - name: offset
          required: false
          in: query
          schema:
            type: integer
        - name: limit
          required: false
          in: query
          schema:
            type: integer
        - name: filter
          required: true
          in: query
          schema:
            type: string
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things':
    get:
      operationId: list_things
      description: List the set of Things.
      summary: List Things
      parameters:
        - name: filter
          required: true
          in: query
          schema:
            type: string
        - name: offset
          required: false
          in: query
          schema:
            type: integer
        - name: limit
          required: false
          in: query
          schema:
            type: integer
</pre>
</td>
</tr>
</table>


### Rule: parameter-schema-or-content
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>parameter-schema-or-content</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Each parameter must provide either a <code>schema</code> or <code>content</code> object.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>error</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
parameters:
- name: param1
  in: query
  description: query param
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
parameters:
- name: param1
  in: query
  description: query param
  schema:
    type: string
</pre>
</td>
</tr>
</table>


### Rule: prohibit-summary-sentence-style
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>prohibit-summary-sentence-style</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>An operation's <code>summary</code> field should not have a trailing period.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  /v1/things
    get:
      operationId: list_things
      summary: List Things.
      description: Retrieve a paginated collection of Thing instances.
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  /v1/things
    get:
      operationId: list_things
      summary: List Things
      description: Retrieve a paginated collection of Thing instances.
</pre>
</td>
</tr>
</table>


### Rule: property-case-collision
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>property-case-collision</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Property names within a schema must be unique, even if they differ by case convention
(e.g. properties <code>thingType</code> and <code>thing_type</code> defined within the same schema would violate this rule).</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>error</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas2, oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      type: object
      properties:
        thing_id:
          type: string
        thing_type:
          type: string
        thingType:
          type: string
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      type: object
      properties:
        thing_id:
          type: string
        thing_type:
          type: string
</pre>
</td>
</tr>
</table>


### Rule: property-case-convention
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>property-case-convention</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Schema property names should follow a specific case convention, with the default being snake case.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>error</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas2, oas3</td>
</tr>
<tr>
<td valign=top><b>Configuration:</b></td>
<td>This rule can be configured to enforce a specific case convention for schema property names.
To configure the rule, set the <code>functionOptions</code> field within the rule definition to be an object
that is the appropriate configuration to be used by Spectral's <code>casing()</code> function
[<a href="https://meta.stoplight.io/docs/spectral/ZG9jOjExNg-core-functions#casing">1</a>]
to enforce the desired case convention for property names.
<p>The default configuration object provided in the rule definition is:
<pre>
{
  type: 'snake'
}
</pre>
<p>To enforce a different case convention for property names, you'll need to
<a href="#replace-a-rule-from-ibm-cloudopenapi-ruleset">replace this rule with a new rule within your
custom ruleset</a> and modify the configuration such that the value of the <code>type</code> field 
specifies the desired case convention.
For example, to enforce camel case for property names, the configuration object would look like this:
<pre>
{
  type: 'camel'
}
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      type: object
      properties:
        thingId:
          type: string
        thingType:
          type: string
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      type: object
      properties:
        thing_id:
          type: string
        thing_type:
          type: string
</pre>
</td>
</tr>
</table>


### Rule: property-description
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>property-description</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Schema properties should have a non-empty description.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas2, oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      type: object
      properties:
        thing_id:
          type: string
        thing_type:
          type: string
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      type: object
      properties:
        thing_id:
          description: The ID associated with the Thing instance.
          type: string
        thing_type:
          description: The type associated with the Thing instance.
          type: string
</pre>
</td>
</tr>
</table>


### Rule: property-inconsistent-name-and-type
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>property-inconsistent-name-and-type</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Avoid using the same property name for properties of different types.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas2, oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      type: object
      properties:
        name:
          description: The name of the Thing.
          type: string
    OtherThing:
      type: object
      properties:
        name:
          description: The name of the OtherThing.
          type: integer # The property 'name' should use consistent types throughout the API
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      type: object
      properties:
        name:
          description: The name of the Thing.
          type: string
    OtherThing:
      type: object
      properties:
        name:
          description: The name of the OtherThing.
          type: string
</pre>
</td>
</tr>
</table>


### Rule: request-body-name
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>request-body-name</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>The <code>x-codegen-request-body-name</code> extension can be set on an operation to provide a language-agnostic
name for any body parameter that might appear within generated SDK code.
For operations that support multipart-form-based request body content, this isn't necessary since the
names of the form parameters are inferred from the property names within the request body schema.
However, for operations that support other non-form-based request body content (json-based and non-json-based content alike),
it is a good practice to provide the request body name via the extension, especially in situations where there is no other
way to infer a logical name for the operation's body parameter.
<p>This rule analyzes each operation to determine if a request body name is needed, and if so, checks to make sure 
that the <code>x-codegen-request-body-name</code> extension is set on the operation.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/logs':
    post:
      operationId: upload_logfile
      requestBody:
        content:
          'application/octet-stream':
            schema:
              type: string
              format: binary
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/logs':
    post:
      operationId: upload_logfile
      x-code-gen-request-body-name: log_file   &lt;&lt;&lt;
      requestBody:
        content:
          'application/octet-stream':
            schema:
              type: string
              format: binary
</pre>
</td>
</tr>
</table>


### Rule: request-body-object
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>request-body-object</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Each request body should be defined as an object.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
requestBody:
  content:
    application/json:
      schema:
        type: string
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
requestBody:
  content:
    application/json:
      schema:
        type: object
        properties:
          prop1:
            type: string
</pre>
</td>
</tr>
</table>


### Rule: response-error-response-schema
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>response-error-response-schema</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td><code>4xx</code> and <code>5xx</code> error responses should provide sufficient information
to help the user resolve the error
[<a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-errors">1</a>].
This rule is more lenient than the guidance outlined in the API Handbook.
Specifically, the rule does not require an "Error Container Model"
and allows for a single "Error Model" to be provided at the top level of the error response schema or in an <code>error</code> field.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
n/a
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
n/a
</td>
</tr>
</table>


### Rule: response-example-provided
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>response-example-provided</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Response examples should be provided in the schema object - or as a sibling to the schema object -
within each response <code>content</code> field entry, in order to aid in the generation of API reference documentation.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
responses:
  200:
    content:
      application/json:
        schema:
          type: string
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
The example may be provided in the schema object.
<pre>
responses:
  200:
    content:
      application/json:
        schema:
          type: string
          example: 'example string'
</pre>
<p>Alternatively, the example may be provided as a sibling to the schema object.
<pre>
responses:
  200:
    content:
      application/json:
        schema:
          type: string
        example: 'example string'
<pre>
</td>
</tr>
</table>


### Rule: schema-description
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>schema-description</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Schemas should have a non-empty description.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas2, oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      type: object
      properties:
        ...
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      description: >-
        A Thing instance is used as a way to demonstrate how various
        validation rules may be applied to an API definition.
      type: object
      properties:
        ...
</pre>
</td>
</tr>
</table>


### Rule: security-schemes
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>security-schemes</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Verifies the security schemes and security requirement objects.
<p>Specifically, the rule will perform these checks:
<ol>
<li>The name used within a security requirement object must correspond to a
security scheme that is properly defined in "components.securitySchemes".
</li>
<li>Each security scheme defined in "components.securitySchemes" should be referenced
by at least one security requirement object.
</li>
<li>Each scope referenced within a security requirement object for an oauth2-type security scheme
must be defined within that security scheme.
</li>
<li>Each scope that is defined within an oath2-type security scheme should be
referenced by at least one security requirement object.
</li>
<li>If a security requirement object is associated with a security scheme that does not support
scopes, then its scopes array MUST be empty.
</li>
</ol>
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/things':
    post:
      operationId: create_thing
      security:
        - IAM: []   # refers to undefined security scheme "IAM"
components:
  securitySchemes:
    Basic:
      type: http
      scheme: basic
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things':
    post:
      operationId: create_thing
      security:
        - IAM: []
components:
  securitySchemes:
    IAM:
      in: header
      name: Authorization
      type: apiKey
</pre>
</td>
</tr>
</table>


### Rule: server-variable-default-value
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>server-variable-default-value</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Server variables should have a default value.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
servers:
- url: https://{region}.myservice.cloud.ibm.com
  description: The region-based endpoints available for My Service.
  variables:
    region:
      description: >-
        The name of the region, which should be one of:
          "global", "us-south", "us-east", "us-west", "us-north"
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
servers:
- url: https://{region}.myservice.cloud.ibm.com
  description: The region-based endpoints available for My Service.
  variables:
    region:
      default: global
      description: >-
        The name of the region, which should be one of:
          "global", "us-south", "us-east", "us-west", "us-north"
</pre>
</td>
</tr>
</table>


### Rule: string-boundary
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>string-boundary</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>String schema properties should define the <code>pattern</code>, <code>minLength</code> and <code>maxLength</code> fields
[<a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-types#string">1</a>].</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      description: A Thing instance.
      type: object
      properties:
        thing_id:
          description: The unique identifier of the Thing instance.
          type: string
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      description: A Thing instance.
      type: object
      properties:
        thing_id:
          description: The unique identifier of the Thing instance.
          type: string
          pattern: '^[a-zA-Z0-9]*$'
          minLength: 8
          maxLength: 64
          example: 'ab38dd26z'
</pre>
</td>
</tr>
</table>


### Rule: unused-tag
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>unused-tag</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule verifies that each tag (defined in the <code>tags</code> field) is referenced by one or more operations.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
tags:
  - name: Things
    description: Operations related to Things.
  - name: UnusedTag
    description: This tag is not used.

paths:
  '/v1/things':
    post:
      operationId: create_thing
      description: Create a new Thing instance.
      summary: Create a Thing
      tags:
        - Things
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
tags:
  - name: Things
    description: Operations related to Things.

paths:
  '/v1/things':
    post:
      operationId: create_thing
      description: Create a new Thing instance.
      summary: Create a Thing
      tags:
        - Things
</pre>
</td>
</tr>
</table>


### Rule: valid-type-format
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>valid-type-format</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Schemas and schema properties must use a valid combination of the <code>type</code> and <code>format</code> fields
[<a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-types">1</a>].
The following table defines the valid combinations:
<table>
<tr><th>Type</th><th>Formats</th></tr>
<tr>
<td valign=top>string</td>
<td>
<ul>
<li>binary</li>
<li>byte</li>
<li>crn</li>
<li>date</li>
<li>date-time</li>
<li>email</li>
<li>identifier</li>
<li>password</li>
<li>url</li>
<li>uuid</li>
</ul>
</td>
</tr>
<tr><td>boolean</td><td></td></tr>
<tr><td valign=top>integer</td><td><ul><li>int32</li><li>int64</li></ul></td></tr>
<tr><td valign=top>number</td><td><ul><li>float</li><li>double</li></ul></td></tr>
<tr><td>object</td><td></td></tr>
<tr><td>array</td><td></td></tr>
</table>
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>error</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      type: bad_object
      properties:
        thing_url:
          type: url
        thing_crn:
          type: crn
        thing_cost:
          type: float
        thing_contents:
          type: byte-array
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      type: object
      properties:
        thing_url:
          type: string
          format: url
        thing_crn:
          type: string
          format: crn
        thing_cost:
          type: number
          format: float
        thing_contents:
          type: string
          format: byte
</pre>
</td>
</tr>
</table>
