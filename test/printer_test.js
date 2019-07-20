'use strict';

import test from 'ava';
import config from '../src/lib/config';
import printer from '../src/lib/printer';

const Config = new config();

test('print header', t => {
  const Printer = new printer([], '0.1.0', Config);
  const output = Printer.print({
    timestamp: new Date('2015/01/01')
  });

  t.truthy(output);
  t.is(output, '# 0.1.0 (2015/1/1)\n\n');
});

test('print one section with two issues', t => {
  const Printer = new printer([
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
  ], '0.1.0', Config);
  const output = Printer.print({
    timestamp: new Date('2015/01/01')
  });

  t.snapshot(output);
});

test('print one section with one issue', t => {
  const Printer = new printer([
    {
      type: 'fix',
      component: 'lorax',
      message: 'This is a test',
      hash: '123456',
      issues: ['321'],
      title: 'Some random title'
    }
  ], '0.1.0', Config);
  const output = Printer.print({
    timestamp: new Date('2015/01/01')
  });

  t.snapshot(output);
});

test('print one section with no issue', t => {
  const Printer = new printer([
    {
      type: 'fix',
      component: 'lorax',
      message: 'This is a test',
      hash: '123456',
      issues: [],
      title: 'Some random title'
    }
  ], '0.1.0', Config);
  const output = Printer.print({
    timestamp: new Date('2015/01/01')
  });

  t.snapshot(output);
});

test('print two sections', t => {
  const Printer = new printer([
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
  ], '0.1.0', Config);
  const output = Printer.print({
    timestamp: new Date('2015/01/01')
  });

  t.snapshot(output);
});

test('print two components in one section', t => {
  const Printer = new printer([
    {
      type: 'fix',
      component: 'lorax',
      message: 'This is a test',
      hash: '123456',
      issues: []
    },
    {
      type: 'fix',
      component: 'lorax',
      message: 'This is my second test',
      hash: '92749a8',
      issues: []
    },
    {
      type: 'fix',
      component: 'config',
      message: 'Trying to fix config',
      hash: '321',
      issues: []
    }
  ], '0.1.0', Config);
  const output = Printer.print({
    timestamp: new Date('2015/01/01')
  });
  
  t.snapshot(output);
});
