import type { ExtendEditorTransforms } from '@udecode/plate';

import type { ImageConfig } from './BaseImagePlugin';

import { insertImage } from './transforms/insertImage';
import { isImageUrl } from './utils/isImageUrl';

/** If inserted text is image url, insert image instead. */
export const withImageEmbed: ExtendEditorTransforms<ImageConfig> = ({
  editor,
  getOptions,
  tf: { insertData },
}) => ({
  insertData(dataTransfer) {
    if (getOptions().disableEmbedInsert) {
      return insertData(dataTransfer);
    }

    const text = dataTransfer.getData('text/plain');

    if (isImageUrl(text)) {
      insertImage(editor, text);

      return;
    }

    insertData(dataTransfer);
  },
});
