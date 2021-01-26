import {Printer} from '../src/lib/printer';
import {Config} from '../src/lib/config';

import anyTest, {TestInterface} from 'ava';

const test = anyTest as TestInterface<{config: Config}>;

test.beforeEach((t) => {
  t.context.config = new Config();
});

test('print header', (t) => {
  const printer = new Printer([], '0.1.0', t.context.config);
  const output = printer.print({
    timestamp: new Date('2015/01/01'),
  });

  t.truthy(output);
  t.is(output, '# 0.1.0 (2015/1/1)\n\n');
});

test('print one section with two issues', (t) => {
  const printer = new Printer(
    [
      {
        type: 'fix',
        component: 'lorax',
        message: 'This is a test',
        hash: '123456',
        issues: [321, 123],
        title: 'Some random title',
      },
    ],
    '0.1.0',
    t.context.config
  );
  const output = printer.print({
    timestamp: new Date('2015/01/01'),
  });

  t.snapshot(output);
});

test('print one section with one issue', (t) => {
  const printer = new Printer(
    [
      {
        type: 'fix',
        component: 'lorax',
        message: 'This is a test',
        hash: '123456',
        issues: [321],
        title: 'Some random title',
      },
    ],
    '0.1.0',
    t.context.config
  );
  const output = printer.print({
    timestamp: new Date('2015/01/01'),
  });

  t.snapshot(output);
});

test('print one section with no issue', (t) => {
  const printer = new Printer(
    [
      {
        type: 'fix',
        component: 'lorax',
        message: 'This is a test',
        hash: '123456',
        issues: [],
        title: 'Some random title',
      },
    ],
    '0.1.0',
    t.context.config
  );
  const output = printer.print({
    timestamp: new Date('2015/01/01'),
  });

  t.snapshot(output);
});

test('print two sections', (t) => {
  const printer = new Printer(
    [
      {
        type: 'fix',
        component: 'lorax',
        message: 'This is a test',
        hash: '123456',
        issues: [],
        title: '',
      },
      {
        type: 'refactor',
        component: 'lorax',
        message: 'This is a refactor',
        hash: '2351',
        issues: [],
        title: '',
      },
    ],
    '0.1.0',
    t.context.config
  );
  const output = printer.print({
    timestamp: new Date('2015/01/01'),
  });

  t.snapshot(output);
});

test('print two components in one section', (t) => {
  const printer = new Printer(
    [
      {
        type: 'fix',
        component: 'lorax',
        message: 'This is a test',
        hash: '123456',
        issues: [],
        title: '',
      },
      {
        type: 'fix',
        component: 'lorax',
        message: 'This is my second test',
        hash: '92749a8',
        issues: [],
        title: '',
      },
      {
        type: 'fix',
        component: 'config',
        message: 'Trying to fix config',
        hash: '321',
        issues: [],
        title: '',
      },
    ],
    '0.1.0',
    t.context.config
  );
  const output = printer.print({
    timestamp: new Date('2015/01/01'),
  });

  t.snapshot(output);
});

test('print without url', (t) => {
  t.context.config.set('url', '');
  const printer = new Printer(
    [
      {
        type: 'fix',
        component: 'lorax',
        message: 'This is a test',
        hash: '123456',
        issues: [],
        title: '',
      },
    ],
    '0.1.0',
    t.context.config
  );

  const output = printer.print({
    timestamp: new Date('2015/01/01'),
  });

  t.snapshot(output);
});
