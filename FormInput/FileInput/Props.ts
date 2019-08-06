import { CSSProperties } from 'react';
import { WithStyles } from '@material-ui/core/styles/withStyles';
import { FormInputProps, PropsField } from '../..';
import { lookup } from 'mime-types';
import { Message } from '../../../MessagesTranslate/Animation';
import { styles } from './styles';

export interface Props
  extends Pick<
    FormInputProps,
    | 'ns'
    | 'validateField'
    | 'multiple'
    | 'InputProps'
    | 'label'
    | 'name'
    | 'value'
    | 'type'
    | 'error'
    | 'disabled'
    | 'changeField'
    | 'sendChange'
    | 'extraProps'
  > {}
export interface AllProps extends Props, WithStyles<typeof styles> {}

export declare type FileVa =
  | File
  | string
  | { url: string; extension: string };

export interface Value {
  file: FileVa;
  id: string;
  invalid: boolean;
}

export declare type Lookup = typeof lookup;

export declare type FileValue = Value[];

export interface States {
  value: FileValue;
  valueFiles: { id: string; file: File }[];
  valueTemp: FileValue;
  inputValue: string;
}

export interface ListFilesProps
  extends Pick<PropsField, 'label' | 'ns' | 'name'> {
  files: FileValue;
  openFileDialog: () => void;
  deleteFile: (id: string) => void;
  subLabel?: Message;
}
export declare type ListFilesStates = Pick<
  CSSProperties,
  'backgroundColor'
>;

export declare type handleChangeFiles = (target: {
  files: FileList | null;
  value?: any;
}) => void;

export interface PropsGetThumbnail {
  file: FileVa;
  invalid?: boolean;
  classes?: { img: string };
  lookup?: Lookup;
}
