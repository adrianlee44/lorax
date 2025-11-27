import Printer from '../src/lib/printer';
import Config from '../src/lib/config';

let config: Config;

beforeEach(() => {
  config = new Config();
});

test('print header', () => {
  const printer = new Printer([], '0.1.0', config);
  const output = printer.print({
    timestamp: new Date('2015/01/01'),
  });

  expect(output).toBeTruthy();
  expect(output).toBe('# 0.1.0 (2015/1/1)\n\n');
});

test('print one section with two issues', () => {
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
    config
  );
  const output = printer.print({
    timestamp: new Date('2015/01/01'),
  });

  expect(output).toMatchSnapshot();
});

test('print one section with one issue', () => {
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
    config
  );
  const output = printer.print({
    timestamp: new Date('2015/01/01'),
  });

  expect(output).toMatchSnapshot();
});

test('print one section with no issue', () => {
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
    config
  );
  const output = printer.print({
    timestamp: new Date('2015/01/01'),
  });

  expect(output).toMatchSnapshot();
});

test('print two sections', () => {
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
    config
  );
  const output = printer.print({
    timestamp: new Date('2015/01/01'),
  });

  expect(output).toMatchSnapshot();
});

test('print two components in one section', () => {
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
    config
  );
  const output = printer.print({
    timestamp: new Date('2015/01/01'),
  });

  expect(output).toMatchSnapshot();
});

test('print without url', () => {
  config.set('url', '');
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
    config
  );

  const output = printer.print({
    timestamp: new Date('2015/01/01'),
  });

  expect(output).toMatchSnapshot();
});
