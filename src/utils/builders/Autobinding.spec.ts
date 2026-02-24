import { describe, it } from 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import FieldBuilder from './FieldBuilder';
import { buildField } from '../buildField';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Autobinding', () => {
  it('should maintain "this" context for setValue (extracted as callback)', async () => {
    const field = buildField({
      name: 'test',
      value: 'initial',
    });

    const setValue = field.setValue;
    // Calling it without 'field.' prefix
    await setValue('new-value');

    expect(field.value).to.equal('new-value');
  });

  it('should maintain "this" context for disable/enable (extracted as callback)', () => {
    const field = buildField({
      name: 'test',
      value: 'initial',
    });

    const disable = field.disable;
    const enable = field.enable;

    disable();
    expect(field.disabled).to.be.true;

    enable();
    expect(field.disabled).to.be.false;
  });

  it('should maintain "this" context for markAsTouched (arrow function)', () => {
    const field = buildField({
      name: 'test',
      value: 'initial',
    });

    const markAsTouched = field.markAsTouched;
    markAsTouched();

    expect(field.touched).to.be.true;
  });

  it('should maintain "this" context for hasErrors (arrow function)', async () => {
    const field = buildField({
      name: 'test',
      value: '',
      validations: [
        ({ value }) =>
          value === '' ? { required: 'error' } : undefined,
      ],
    });

    const hasErrors = field.hasErrors;
    const result = await hasErrors();

    expect(result).to.be.true;
  });
});
