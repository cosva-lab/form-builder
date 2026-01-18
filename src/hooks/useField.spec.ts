import { renderHook } from '@testing-library/react-hooks';
import useField from './useField';
import { expect } from 'chai';

describe('useField', () => {
  it('should work with arrow function initializer', () => {
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
    expect(field.name).to.eq('name');
  });

  it('should have undefined label if not provided', () => {
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

  it('should have defined label if provided', () => {
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

  it('should correctly set the field type', () => {
    const {
      result: { current: field },
    } = renderHook(() =>
      useField({
        name: 'type',
        label: 'type',
        type: 'text',
        value: '' as string | number,
      }),
    );
    expect(field.type).to.eq('text');
  });

  it('should infer the value type in validations', () => {
    const {
      result: { current: field },
    } = renderHook(() =>
      useField({
        name: 'type',
        value: '' as string | number,
        validations: [
          ({ value }) => {
            // This is primarily a type check test
            const x: string | number = value;
            return {
              custom: {
                rule: 'isEmpty' as const,
              },
            };
          },
          ({ value }) => {
            // This is primarily a type check test
            const x: string | number = value;
            return {
              custom: {
                rule: 'isNumber' as const,
              },
            };
          },
        ],
      }),
    );

    expect(field.value).to.eq('');
  });

  it('should support enums and complex types for value', () => {
    enum BovineFields {
      developmentStage = 'developmentStage',
    }

    interface AnimalDevelopmentStageInfoFragment {
      id: string;
      name: string;
      description: string;
    }

    const {
      result: { current: field },
    } = renderHook(() =>
      useField({
        name: BovineFields.developmentStage,
        label: 'Development Stage',
        value: [] as AnimalDevelopmentStageInfoFragment[],
      }),
    );

    field.name satisfies BovineFields.developmentStage;

    expect(field.name).to.eq(BovineFields.developmentStage);
    expect(field.value).to.be.an('array').with.lengthOf(0);
  });
});
