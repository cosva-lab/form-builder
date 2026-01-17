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
  it('Type is defined', () => {
    const {
      result: { current: field },
    } = renderHook(() =>
      useField(() => ({
        name: 'type',
        label: 'type',
        type: 'text',
        value: '' as string | number,
      })),
    );
    expect(field.type).to.eq('text');
  });

  it('Inference validation value', () => {
    const {
      result: { current: field },
    } = renderHook(() =>
      useField(() => ({
        name: 'type',
        value: '' as string | number,
        validations: [
          ({ value }) => {
            const x: string | number = value;
            return undefined;
          },
        ],
      })),
    );
  });
});
