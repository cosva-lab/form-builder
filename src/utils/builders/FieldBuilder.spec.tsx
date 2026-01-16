import FieldBuilder from './FieldBuilder';

describe('FieldBuilder', () => {
  it('The type label is generic', () => {
    const field = new FieldBuilder({
      name: 'name',
      value: [],
    });
    expect(field.name).toBe(undefined);
  });
});
