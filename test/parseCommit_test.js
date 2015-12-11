import test from 'ava';

const lorax = require("../index");
const commit = "7e7ac8957953e1686113f8086dc5b67246e5d3fa\nfeature(lorax): Basic testing\n\nFixes #123";

test('hash parse', t => {
  const obj = lorax.parseCommit(commit);
  t.is(obj.hash, "7e7ac8957953e1686113f8086dc5b67246e5d3fa");
});

test('type parse', t => {
  const obj = lorax.parseCommit(commit);
  t.is(obj.type, "feature");
});

test('component parse', t => {
  const obj = lorax.parseCommit(commit);
  t.is(obj.component, "lorax");
});

test('component special character parse', t => {
  const specialCommit = "7e7ac8957953e1686113f8086dc5b67246e5d3fa\nfeature(lorax-test!): Basic testing";
  const obj = lorax.parseCommit(specialCommit);
  t.is(obj.component, "lorax-test!");
});

test('message parse', t => {
  const obj = lorax.parseCommit(commit);
  t.is(obj.message, "Basic testing");
});

test('title parse', t => {
  const obj = lorax.parseCommit(commit);
  t.is(obj.title, "feature(lorax): Basic testing");
});

test('issue parse', t => {
  const obj = lorax.parseCommit(commit);
  t.is(obj.issues[0], 123);
});

test('issues parse', t => {
  const issuesCommit = "7e7ac8957953e1686113f8086dc5b67246e5d3fa\nfeature(lorax): Basic testing\n\nFixes #123\nFixes #124";
  const obj = lorax.parseCommit(issuesCommit);
  t.is(obj.issues[0], 123);
  t.is(obj.issues[1], 124);
});

test('breaking change parse', t => {
  const breakingCommit = "7e7ac8957953e1686113f8086dc5b67246e5d3fa\nfeature(lorax): Basic testing\n\nBREAKING CHANGE: Testing";
  const obj = lorax.parseCommit(breakingCommit);
  t.is(obj.type, "breaking");
  t.is(obj.message, " Testing");
});

test('long message parse', t => {
  let longMessage;
  longMessage = "7e7ac8957953e1686113f8086dc5b67246e5d3fa\nfeature(lorax): Basic testing\n";
  longMessage += "Additional features:\n";
  longMessage += "-foo\n";
  longMessage += "-bar";

  const obj = lorax.parseCommit(longMessage);
  t.is(obj.message, "Basic testing\nAdditional features:\n-foo\n-bar");
});

test('code example in commit parse', t => {
  let codeMessage = "7e7ac8957953e1686113f8086dc5b67246e5d3fa\nfeature(lorax): Basic testing\n";
  codeMessage += "Example:\n";
  codeMessage += "```\n";
  codeMessage += "var test='hello';\n";
  codeMessage += "test = test.replace('ll', 'r');\n";
  codeMessage += "console.log(test);\n";
  codeMessage += "```\n";

  const obj = lorax.parseCommit(codeMessage);
  t.is(obj.message, "Basic testing\nExample:\n```\nvar test='hello';\ntest = test.replace('ll', 'r');\nconsole.log(test);\n```\n");
});
