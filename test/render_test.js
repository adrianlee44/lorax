import test from 'ava';
import {render} from '../index';

test('render header', t => {
  const output = render([], '0.1.0', {
    timestamp: new Date('2015/01/01')
  });

  t.ok(output);
  t.is(output, '# 0.1.0 (2015/1/1)\n\n');
});

test('render one section with two issues', t => {
  const output = render([
    {
      type: 'fix',
      component: 'lorax',
      message: 'This is a test',
      hash: '123456',
      issues: [
        '321',
        '123'
      ],
      title: 'Some random title'
    }
  ], '0.1.0', {
    timestamp: new Date('2015/01/01')
  });

  t.ok(output);

  const expected = `# 0.1.0 (2015/1/1)
## Bug Fixes
- **lorax:** This is a test
  ([123456](https://github.com/adrianlee44/lorax/commit/123456),
   [#321](https://github.com/adrianlee44/lorax/issues/321), [#123](https://github.com/adrianlee44/lorax/issues/123))\n\n\n`

  t.is(output, expected);
});

test('render one section with one issue', t => {
  const output = render([
    {
      type: 'fix',
      component: 'lorax',
      message: 'This is a test',
      hash: '123456',
      issues: ['321'],
      title: 'Some random title'
    }
  ], '0.1.0', {
    timestamp: new Date('2015/01/01')
  });

  t.ok(output);

  const expected = `# 0.1.0 (2015/1/1)
## Bug Fixes
- **lorax:** This is a test
  ([123456](https://github.com/adrianlee44/lorax/commit/123456),
   [#321](https://github.com/adrianlee44/lorax/issues/321))\n\n\n`

  t.is(output, expected);
});

test('render one section with no issue', t => {
  const output = render([
    {
      type: 'fix',
      component: 'lorax',
      message: 'This is a test',
      hash: '123456',
      issues: [],
      title: 'Some random title'
    }
  ], '0.1.0', {
    timestamp: new Date('2015/01/01')
  });

  t.ok(output);

  const expected = `# 0.1.0 (2015/1/1)
## Bug Fixes
- **lorax:** This is a test
  ([123456](https://github.com/adrianlee44/lorax/commit/123456))\n\n\n`

  t.is(output, expected);
});

test('render two sections', t => {
  const output = render([
    {
      type: 'fix',
      component: 'lorax',
      message: 'This is a test',
      hash: '123456',
      issues: []
    },
    {
      type: 'refactor',
      component: 'lorax',
      message: 'This is a refactor',
      hash: '2351',
      issues: []
    }
  ], '0.1.0', {
    timestamp: new Date('2015/01/01')
  });

  t.ok(output);

  const expected = `# 0.1.0 (2015/1/1)
## Bug Fixes
- **lorax:** This is a test
  ([123456](https://github.com/adrianlee44/lorax/commit/123456))

## Optimizations
- **lorax:** This is a refactor
  ([2351](https://github.com/adrianlee44/lorax/commit/2351))\n\n\n`

  t.is(output, expected);
});

test('render two components in one section', t => {
  const output = render([
    {
      type: 'fix',
      component: 'lorax',
      message: 'This is a test',
      hash: '123456',
      issues: []
    },
    {
      type: 'fix',
      component: 'config',
      message: 'Trying to fix config',
      hash: '321',
      issues: []
    }
  ], '0.1.0', {
    timestamp: new Date('2015/01/01')
  });

  t.ok(output);

  const expected = `# 0.1.0 (2015/1/1)
## Bug Fixes
- **config:** Trying to fix config
  ([321](https://github.com/adrianlee44/lorax/commit/321))
- **lorax:** This is a test
  ([123456](https://github.com/adrianlee44/lorax/commit/123456))\n\n\n`

  t.is(output, expected);
});
