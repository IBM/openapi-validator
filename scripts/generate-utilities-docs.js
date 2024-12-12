#!/usr/bin/env node

const mustache = require('mustache');
const { readFileSync, writeFileSync } = require('fs');
const { execSync } = require('child_process');

const template = readFileSync('scripts/templates/package.mustache', {
  encoding: 'utf8',
});

const raw = JSON.parse(
  execSync(
    'jsdoc -X packages/utilities/src/index.js packages/utilities/src/**/*.js',
    { encoding: 'utf8' }
  )
);

const docs = raw.filter(d => d.comment !== '' && d.access !== 'private');

const packageDefinition = docs.find(d => d.kind === 'module');

const constants = docs
  .filter(d => d.kind === 'constant')
  .map(c => {
    const members = docs.filter(
      d => d.kind === 'member' && d.memberof === c.longname
    );

    return {
      name: c.name,
      description: c.description,
      members,
      hasMembers: members.length > 0,
    };
  });

const functions = docs
  .filter(d => d.kind === 'function')
  .map(f => ({
    signature: `${f.name}(${f.params.map(p => p.name).join(', ')})`,
    params: f.params.map(p => ({
      name: p.name,
      type: p.type?.names?.join(' | '),
      description: p.description,
    })),
    description: f.description,
    returns: f.returns?.map(r => ({
      type: r.type?.names?.join(' | '),
      description: r.description,
    })),
  }));

const rendered = mustache.render(template, { package: packageDefinition, constants, functions });

writeFileSync('docs/openapi-ruleset-utilities.md', rendered);
