import { CSSProperties } from 'react';
import { FormInputProps, PropsField } from '../..';
import { SortEnd } from 'react-sortable-hoc';
import { Message } from '../../types';

export interface ActionsFiles {
  onAdd?:
    | ((
        file: Files,
      ) =>
        | Promise<
            { callBack: () => void; value?: Files } | void | Files
          >
        | void
        | { callBack: () => void; value: Files }
      )
    | null;
  onDelete?:
    | ((
        file: Files,
      ) =>
        | Promise<{ callBack: () => void } | void>
        | void
        | { callBack: () => void }
      )
    | null;
  onSort?: (event: {
    changedFiles: { newFile: FileValue; oldFile: FileValue };
    sort: SortEnd;
  }) =>
    | Promise<{ callBack: () => void } | void>
    | void
    | { callBack: () => void };

  sort?: (a: FileValue, b: FileValue) => number | false | void;
  arrayMove?: (files: Files, from: number, to: number) => Files;
}

export interface Props
  extends Pick<
      FormInputProps,
      | 'ns'
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
  value: Files;
  fieldProxy?: PropsField<Files>;
}

export interface ExtraFile {
  [key: string]: any;
  type?: string;
}

export interface FileValue {
  url?: string;
  file?: File;
  extra?: ExtraFile;
  invalid?: boolean;
}
export declare type Files = FileValue[];

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

export interface State {
  valueTemp: Files;
  inputValue: string;
  loading: boolean;
}

export interface ListFilesProps
  extends Pick<PropsField, 'label' | 'ns' | 'name' | 'fieldProxy'> {
  files: Files;
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
  value: FileValue;
  invalid?: boolean;
  classes?: { img: string };
}
