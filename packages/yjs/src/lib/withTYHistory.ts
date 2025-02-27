import type { SlateEditor } from '@udecode/plate';
import type * as Y from 'yjs';

import {
  type WithYHistoryOptions,
  type YjsEditor,
  withYHistory,
} from '@slate-yjs/core';

import type { YjsEditorProps } from './withTYjs';

export type YHistoryEditor = {
  redo: () => void;

  undo: () => void;

  undoManager: Y.UndoManager;
  withoutSavingOrigin: unknown;
} & YjsEditor;

export type YHistoryEditorProps = Pick<
  YHistoryEditor,
  'redo' | 'undo' | 'undoManager' | 'withoutSavingOrigin'
> &
  YjsEditorProps;

export const withTYHistory = (
  editor: SlateEditor,
  options?: WithYHistoryOptions
) =>
  withYHistory(editor as any, options) as SlateEditor &
    YHistoryEditorProps &
    YjsEditorProps;
