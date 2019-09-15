import { CSSProperties } from 'react';
import { FormInputProps, PropsField } from '../..';
import { Message } from '../../../MessagesTranslate/Animation';
import { SortEnd } from 'react-sortable-hoc';

export interface ActionsFiles {
  onAdd?:
    | ((
        file: Value[],
      ) =>
        | Promise<
            | { callBack: () => void; value?: FileVa[] }
            | void
            | FileVa[]
          >
        | void
        | { callBack: () => void; value: FileVa[] }
      )
    | null;
  onDelete?:
    | ((
        file: FileVa[],
      ) =>
        | Promise<{ callBack: () => void } | void>
        | void
        | { callBack: () => void }
      )
    | null;
  onSort?: (event: {
    changedFiles: { newFile: FileVa; oldFile: FileVa };
    sort: SortEnd;
  }) =>
    | Promise<{ callBack: () => void } | void>
    | void
    | { callBack: () => void };

  sort?: (a: FileVa, b: FileVa) => number | false | void;
  arrayMove?: (files: Value[], from: number, to: number) => Value[];
}

export interface Props
  extends Pick<
      FormInputProps,
      | 'ns'
      | 'validateField'
      | 'multiple'
      | 'inputProps'
      | 'label'
      | 'name'
      | 'value'
      | 'type'
      | 'error'
      | 'disabled'
      | 'extraProps'
    >,
    Partial<Pick<FormInputProps, 'changeField'>>,
    ActionsFiles {
  value: FileVa[];
}

export interface ExtraFile {
  [key: string]: any;
  type?: string;
}

export type FileVa =
  | File
  | {
      url?: string;
      file?: File;
      extra?: ExtraFile;
      invalid?: boolean;
    };

export interface Value {
  value: FileVa;
  id: string;
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
export declare type Files = Value[];

export interface State {
  value: Files;
  valueTemp: Files;
  inputValue: string;
  loading: boolean;
}

export interface ListFilesProps
  extends Pick<PropsField, 'label' | 'ns' | 'name'> {
  files: Files;
  openFileDialog: () => void;
  deleteFile: (index: number, sendChange?: boolean) => Promise<void>;
  subLabel?: Message;
}
export declare type ListFilesStates = Pick<
  CSSProperties,
  'backgroundColor'
> & {
  files: Files;
};

export declare type handleChangeFiles = (target: {
  files: FileList | null;
  value?: any;
}) => void;

export interface PropsGetThumbnail {
  value: FileVa;
  invalid?: boolean;
  classes?: { img: string };
}
