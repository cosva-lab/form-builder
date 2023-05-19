import { observable, makeObservable, action } from 'mobx';
import type {
  ValidationErrors,
  OnSetValue,
  OnChangeField,
  LabelPropsField,
  value,
  TypeField,
  PropsFieldBase,
  NameField,
} from '../../types';
import { StatusField } from '../../enums';
import { GenericFieldsBuilder } from '../../types';

export class Field<
  V,
  Name extends NameField,
  Label extends LabelPropsField,
> implements PropsFieldBase<V, Name, Label>
{
  public fieldsBuilder?: GenericFieldsBuilder = undefined;
  @observable public type?: TypeField = undefined;
  @observable public name: Name;
  @observable public value: V;
  @observable public defaultInputValue?: V = undefined;
  @observable public label: Label;
  @observable public status?: StatusField;
  @observable public errors?: ValidationErrors = [];
  public inputRef?: HTMLInputElement | null;
  @observable public onChange?: OnChangeField<V, Name, Label> =
    undefined;
  @observable public onSetValue?: OnSetValue<V, Name, Label> =
    undefined;

  public pristine: boolean = true;

  /**
   * A control is `dirty` if the user has changed the value
   * in the UI.
   *
   * @returns True if the user has changed the value of this control in the UI; compare `pristine`.
   * Programmatic changes to a control's value do not mark it dirty.
   */
  get dirty(): boolean {
    return !this.pristine;
  }

  /**
   * A control is `valid` when its `status` is `VALID`.
   *
   * @see {@link Field.status}
   *
   * @returns True if the control has passed all of its validation tests,
   * false otherwise.
   */
  get valid(): boolean {
    return this.status === StatusField.VALID;
  }

  /**
   * A control is `invalid` when its `status` is `INVALID`.
   *
   * @see {@link Field.status}
   *
   * @returns True if this control has failed one or more of its validation checks,
   * false otherwise.
   */
  get invalid(): boolean {
    return this.status === StatusField.INVALID;
  }

  /**
   * A control is `pending` when its `status` is `PENDING`.
   *
   * @see {@link Field.status}
   *
   * @returns True if this control is in the process of conducting a validation check,
   * false otherwise.
   */
  get pending(): boolean {
    return this.status == StatusField.PENDING;
  }

  /**
   * A control is `disabled` when its `status` is `DISABLED`.
   *
   * Disabled controls are exempt from validation checks and
   * are not included in the aggregate value of their ancestor
   * controls.
   *
   * @see {@link Field.status}
   *
   * @returns True if the control is disabled, false otherwise.
   */
  get disabled(): boolean {
    return this.status === StatusField.DISABLED;
  }

  /**
   * A control is `enabled` as long as its `status` is not `DISABLED`.
   *
   * @returns True if the control has any status other than 'DISABLED',
   * false if the status is 'DISABLED'.
   *
   * @see {@link Field.status}
   *
   */
  get enabled(): boolean {
    return this.status !== StatusField.DISABLED;
  }

  /**
   * Disables the control. This means the control is exempt from validation checks and
   * excluded from the aggregate value of any parent. Its status is `DISABLED`.
   *
   * If the control has children, all children are also disabled.
   *
   * @see {@link Field.status}
   */
  @action
  disable(): void {
    // If parent has been marked artificially dirty we don't want to re-calculate the
    // parent's dirtiness based on the children.
    this.status = StatusField.DISABLED;
    this.errors = this.errors = [];
  }

  /**
   * Enables the control. This means the control is included in validation checks and
   * the aggregate value of its parent. Its status recalculates based on its value and
   * its validators.
   *
   * By default, if the control has children, all children are enabled.
   *
   * @see {@link Field.status}
   */
  @action
  enable(): void {
    // If parent has been marked artificially dirty we don't want to re-calculate the
    // parent's dirtiness based on the children.
    this.status = StatusField.VALID;
  }

  /**
   * Marks the control as `dirty`. A control becomes dirty when
   * the control's value is changed through the UI; compare `markAsTouched`.
   *
   * @see `markAsTouched()`
   * @see `markAsUntouched()`
   * @see `markAsPristine()`
   *
   */
  markAsDirty(): void {
    this.pristine = false;
  }

  /**
   * Marks the control as `pristine`.
   *
   * If the control has any children, marks all children as `pristine`,
   * and recalculates the `pristine` status of all parent
   * controls.
   *
   * @see `markAsTouched()`
   * @see `markAsUntouched()`
   * @see `markAsDirty()`
   *
   */
  markAsPristine(): void {
    this.pristine = true;
  }

  @action
  _setInitialStatus() {
    this.status = this.disabled
      ? StatusField.DISABLED
      : StatusField.VALID;
  }

  constructor({
    type,
    name,
    value,
    disabled,
    defaultInputValue,
    label,
    onChange,
    onSetValue,
  }: PropsFieldBase<V, Name, Label>) {
    this.type = type;
    this.name = name;
    this.value = value;
    if (disabled) this.disable();
    else this.status = StatusField.VALID;
    this.defaultInputValue = defaultInputValue;
    this.label = label as Label;
    this.onChange = onChange;
    this.onSetValue = onSetValue;
    makeObservable(this);
  }
}

export default Field;
