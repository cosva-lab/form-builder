import { renderHook } from '@testing-library/react-hooks';
import useField from './useField';
import { expect } from 'chai';

describe('useField', () => {
  it('How arrow function works', () => {
    const {
      result: { current: field },
    } = renderHook(() =>
      useField(() => ({
        type: 'text',
        name: 'name',
        value: '',
      })),
    );
    expect(field.label).to.eq(undefined);
  });
  it('Label is undefined', () => {
    const {
      result: { current: field },
    } = renderHook(() =>
      useField({
        type: 'text',
        name: 'name',
        value: '',
      }),
    );
    expect(field.label).to.eq(undefined);
  });
  it('Label is defined', () => {
    const {
      result: { current: field },
    } = renderHook(() =>
      useField({
        type: 'text',
        name: 'name',
        value: '',
        label: 'Name',
      }),
    );
    expect(field.label).to.eq('Name');
  });
});
