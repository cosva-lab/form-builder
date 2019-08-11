import { CSSProperties } from 'react';
import { WithStyles } from '@material-ui/core/styles/withStyles';
import { FormInputProps, PropsField } from '../..';
import { Message } from '../../../MessagesTranslate/Animation';
import { styles } from './styles';

export interface ActionsFiles {
  onAdd?: ((file: File[]) => Promise<void> | void) | null;
  onDelete?: ((file: FileVa[]) => Promise<void> | void) | null;
}

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
      | 'sendChange'
      | 'extraProps'
    >,
    Partial<Pick<FormInputProps, 'changeField'>>,
    ActionsFiles {
  value: FileVa[];
}

export interface AllProps extends Props, WithStyles<typeof styles> {}

export declare type FileVa =
  | File
  | {
      url?: string;
      file?: File;
      extra?: { [key: string]: any; type?: string };
    };

export interface Value {
  value: FileVa;
  invalid: boolean;
}

export declare type Lookup = (
  filenameOrExt: string,
) => string | false;
export declare type ContentType = (
  filenameOrExt: string,
) => string | false;
export declare type Extension = (
  typeString: string,
) => string | false;
export declare type Charset = (typeString: string) => string | false;
export declare type FileValue = Value[];

export interface States {
  value: FileValue;
  valueTemp: FileValue;
  inputValue: string;
  lookup?: Lookup;
}

export interface ListFilesProps
  extends Pick<PropsField, 'label' | 'ns' | 'name'> {
  files: FileValue;
  openFileDialog: () => void;
  deleteFile: (index: number, sendChange?: boolean) => Promise<void>;
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
  value: FileVa;
  invalid?: boolean;
  classes?: { img: string };
}
