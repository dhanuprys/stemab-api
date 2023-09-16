const response = require('../build/response');

test('Generate REST response', () => {
  const rest = response.createRESTResponse(true, 'OK', {});

  expect(rest).toStrictEqual({
    status: true,
    message: 'OK',
    data: {}
  });
});