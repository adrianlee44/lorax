import test from 'ava';
import * as util from '../lib/util';

test('extend', t => {
  const orig = {
    a: "1",
    b: "2"
  };
  const newObj = {
    a: "3",
    c: "4"
  };
  const result = util.extend({}, orig, newObj);

  t.is(result.a, "3");
  t.is(result.b, "2");
  t.is(result.c, "4");
});
