import { CSSProperties } from 'react';
import { WithStyles } from '@material-ui/core/styles/withStyles';
import { FormInputProps, PropsField } from '../..';
import { mimeTypes } from './index';
import { styles } from './styles';
import { Message } from '../../../MessagesTranslate/Animation';

export interface Props
  extends FormInputProps,
    WithStyles<typeof styles> {
  validateField(): void;
}
export interface Value {
  file: File;
  id: string;
  invalid: boolean;
}

export declare type Lookup = (typeof mimeTypes extends Promise<
  infer U
>
  ? U
  : typeof mimeTypes)['lookup'];

export declare type FileValue = Value[] | null | undefined;

export interface States {
  value: FileValue;
  valueTemp: FileValue;
  lookup: Lookup | false;
  inputValue: string;
}

export interface ListFilesProps
  extends Pick<PropsField, 'label' | 'ns' | 'name'> {
  value: FileValue;
  valueTemp: FileValue;
  lookup: Lookup;
  openFileDialog: () => void;
  validateFile: (fileName: string) => boolean;
  deleteFile: (id: string) => void;
  subLabel: Message;
}
export declare type ListFilesStates = Pick<
  CSSProperties,
  'backgroundColor'
>;

export declare type handleChangeFiles = (target: {
  files: FileList | null;
  value?: any;
}) => void;
