const utils = require('../build/utils');

test('Parse NISN Login', () => {
  const date = new Date();
  const payload = Buffer.from(`1234567890|${date.getUTCHours()+(date.getDay()-1)}|12345`).toString('base64');

  expect(utils.parseNISNLogin(payload)).toStrictEqual({ nisn: '1234567890', nis: '12345' });
  expect(utils.parseNISNLogin('2484234298jakdslfj324802948')).toStrictEqual(null);
});

test('Parse daylock', () => {
  const date = new Date();
  const currentFormat = Buffer.from(
    String(date.getDate())
    + String(date.getFullYear()/date.getDate())
    + String(date.getDay())
  ).toString('base64');

  expect(utils.checkDaylock(currentFormat)).toStrictEqual(true);
  expect(utils.checkDaylock('sajoi32r23ioj')).toStrictEqual(false);
  expect(utils.checkDaylock('sajoi32r23ioj', true)).toStrictEqual(true);
});

test('Check if generated timestamp is valid', () => {
  expect(utils.getCurrentDate()).toMatch(/^[\d]?[\d]\s[a-zA-Z]+\s[\d]?[\d],\s[\d]{2}:[\d]{2}:[\d]{2}/);
});