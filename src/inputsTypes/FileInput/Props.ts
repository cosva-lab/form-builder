import { CSSProperties } from 'react';
import { FieldProps } from '../..';
import { SortEnd } from 'react-sortable-hoc';
import { LabelPropsField } from '../../types';
import FieldBuilder from '../../utils/builders/FieldBuilder';
type ResBasic = { callBack: () => void } | void;
type ResOnAdd = void | { callBack: () => void; value: Files } | Files;

export interface ActionsFiles {
  onAdd?: ((file: Files) => Promise<ResOnAdd> | ResOnAdd) | null;
  onDelete?: ((file: Files) => Promise<ResBasic> | ResBasic) | null;
  onSort?: (event: {
    changedFiles: { newFile: FileValue; oldFile: FileValue };
    sort: SortEnd;
  }) => Promise<ResBasic> | ResBasic;
  sort?: (a: FileValue, b: FileValue) => number | false | void;
  arrayMove?: (files: Files, from: number, to: number) => Files;
}

export interface FileInputProps
  extends Partial<Pick<FieldProps, 'changeField'>>,
    ActionsFiles {
  fieldProxy: FieldBuilder<Files>;
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

export interface ListFilesProps {
  fieldProxy: FieldBuilder<any>;
  files: Files;
  openFileDialog: () => void;
  deleteFile: (index: number, sendChange?: boolean) => Promise<void>;
  subLabel?: LabelPropsField;
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
