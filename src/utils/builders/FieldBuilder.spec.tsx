import React from 'react';
import FieldBuilder from './FieldBuilder';

describe('FieldBuilder', () => {
  it('The type label is generic', () => {
    const field = new FieldBuilder({
      type: 'text',
      name: 'name',
      value: '',
    });
    expect(field.label).toBe(undefined);
  });
});
