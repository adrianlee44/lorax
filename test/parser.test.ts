import Parser from '../src/lib/parser';
import Config from '../src/lib/config';

const commit =
  '7e7ac8957953e1686113f8086dc5b67246e5d3fa\nfeature(lorax): Basic testing\n\nFixes #123';

const config = new Config('./test/test_config.json');
const parser = new Parser(config);

test('hash parse', () => {
  const obj = parser.parse(commit);
  expect(obj).toBeTruthy();
  expect(obj && obj.hash).toBe('7e7ac8957953e1686113f8086dc5b67246e5d3fa');
});

test('type parse', () => {
  const obj = parser.parse(commit);
  expect(obj).toBeTruthy();
  expect(obj && obj.type).toBe('feature');
});

test('type parse with regex not matching type name', () => {
  const featCommit =
    '7e7ac8957953e1686113f8086dc5b67246e5d3fa\nfeat(lorax): Basic testing\n\nFixes #123';
  const obj = parser.parse(featCommit);
  expect(obj).toBeTruthy();
  expect(obj && obj.type).toBe('feature');
});

test('component parse', () => {
  const obj = parser.parse(commit);
  expect(obj).toBeTruthy();
  expect(obj && obj.component).toBe('lorax');
});

test('parsing component with whitespace', () => {
  const commitWithWhitespace =
    '7e7ac8957953e1686113f8086dc5b67246e5d3fa\nfeature (lorax): Basic testing\n\nFixes #123';
  const obj = parser.parse(commitWithWhitespace);
  expect(obj).toBeTruthy();
  expect(obj && obj.component).toBe('lorax');
});

test('component special character parse', () => {
  const specialCommit =
    '7e7ac8957953e1686113f8086dc5b67246e5d3fa\nfeature(lorax-test!): Basic testing';
  const obj = parser.parse(specialCommit);
  expect(obj).toBeTruthy();
  expect(obj && obj.component).toBe('lorax-test!');
});

test('message parse', () => {
  const obj = parser.parse(commit);
  expect(obj).toBeTruthy();
  expect(obj && obj.message).toBe('Basic testing');
});

test('parsing message without :', () => {
  const commitWithoutColon =
    '7e7ac8957953e1686113f8086dc5b67246e5d3fa\nfeature(lorax-test) Basic testing';
  const obj = parser.parse(commitWithoutColon);
  expect(obj).toBeTruthy();
  expect(obj && obj.message).toBe('Basic testing');
});

test('title parse', () => {
  const obj = parser.parse(commit);
  expect(obj).toBeTruthy();
  expect(obj && obj.title).toBe('feature(lorax): Basic testing');
});

test('issue parse', () => {
  const obj = parser.parse(commit);
  expect(obj).toBeTruthy();
  expect(obj && obj.issues[0]).toBe(123);
});

test('issues parse', () => {
  const issuesCommit =
    '7e7ac8957953e1686113f8086dc5b67246e5d3fa\nfeature(lorax): Basic testing\n\nFixes #123\nFixes #124';
  const obj = parser.parse(issuesCommit);
  expect(obj).toBeTruthy();
  expect(obj && obj.issues[0]).toBe(123);
  expect(obj && obj.issues[1]).toBe(124);
});

test('breaking change parse', () => {
  const breakingCommit =
    '7e7ac8957953e1686113f8086dc5b67246e5d3fa\nfeature(lorax): Basic testing\n\nBREAKING CHANGE: Testing';
  const obj = parser.parse(breakingCommit);
  expect(obj).toBeTruthy();
  expect(obj && obj.type).toBe('breaking');
  expect(obj && obj.message).toBe(' Testing');
});

test('long message parse', () => {
  let longMessage;
  longMessage =
    '7e7ac8957953e1686113f8086dc5b67246e5d3fa\nfeature(lorax): Basic testing\n';
  longMessage += 'Additional features:\n';
  longMessage += '-foo\n';
  longMessage += '-bar';

  const obj = parser.parse(longMessage);
  expect(obj).toBeTruthy();
  expect(obj && obj.message).toBe(
    'Basic testing\nAdditional features:\n-foo\n-bar'
  );
});

test('code example in commit parse', () => {
  let codeMessage =
    '7e7ac8957953e1686113f8086dc5b67246e5d3fa\nfeature(lorax): Basic testing\n';
  codeMessage += 'Example:\n';
  codeMessage += '```\n';
  codeMessage += "var test='hello';\n";
  codeMessage += "test = test.replace('ll', 'r');\n";
  codeMessage += 'console.log(test);\n';
  codeMessage += '```\n';

  const obj = parser.parse(codeMessage);
  expect(obj).toBeTruthy();
  expect(obj && obj.message).toBe(
    "Basic testing\nExample:\n```\nvar test='hello';\ntest = test.replace('ll', 'r');\nconsole.log(test);\n```\n"
  );
});
