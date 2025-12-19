const timeRegex = /^(1[7-9]|2[0-2]):(00|30)$/;

describe('Time Regex Tests', () => {
  test('valid time "17:00" should match', () => {
    expect(timeRegex.test('17:00')).toBe(true);
  });

  test('valid time "17:30" should match', () => {
    expect(timeRegex.test('17:30')).toBe(true);
  });

  test('valid time "22:00" should match', () => {
    expect(timeRegex.test('22:00')).toBe(true);
  });

  test('valid time "22:30" should match', () => {
    expect(timeRegex.test('22:30')).toBe(true);
  });

  test('invalid time "16:00" should not match', () => {
    expect(timeRegex.test('16:00')).toBe(false);
  });

  test('invalid time "23:00" should not match', () => {
    expect(timeRegex.test('23:00')).toBe(false);
  });

  test('invalid time "17:15" should not match', () => {
    expect(timeRegex.test('17:15')).toBe(false);
  });

  test('invalid time "18:45" should not match', () => {
    expect(timeRegex.test('18:45')).toBe(false);
  });

  test('invalid time "invalid" should not match', () => {
    expect(timeRegex.test('invalid')).toBe(false);
  });
});
