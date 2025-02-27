import {
  type PluginConfig,
  bindFirst,
  createTSlatePlugin,
  isSlatePluginElement,
} from '@udecode/plate';

import type { MediaPluginOptions, TMediaElement } from '../media';

import { insertImageFromFiles } from './transforms';
import { withImageEmbed } from './withImageEmbed';
import { withImageUpload } from './withImageUpload';

export interface TImageElement extends TMediaElement {
  initialHeight?: number;
  initialWidth?: number;
}

export type ImageConfig = PluginConfig<
  'img',
  {
    /**
     * An optional method that will upload the image to a server. The method
     * receives the base64 dataUrl of the uploaded image, and should return the
     * URL of the uploaded image.
     */
    uploadImage?: (
      dataUrl: ArrayBuffer | string
    ) => ArrayBuffer | Promise<ArrayBuffer | string> | string;

    /** Disable url embed on insert data. */
    disableEmbedInsert?: boolean;

    /** Disable file upload on insert data. */
    disableUploadInsert?: boolean;
  } & MediaPluginOptions
>;

/** Enables support for images. */
export const BaseImagePlugin = createTSlatePlugin<ImageConfig>({
  key: 'img',
  node: {
    dangerouslyAllowAttributes: ['alt', 'width', 'height'],
    isElement: true,
    isVoid: true,
  },
})
  .overrideEditor(withImageUpload)
  .overrideEditor(withImageEmbed)
  .extendEditorTransforms(({ editor }) => ({
    insert: {
      imageFromFiles: bindFirst(insertImageFromFiles, editor),
    },
  }))
  .extend(({ plugin }) => ({
    parsers: {
      html: {
        deserializer: {
          parse: ({ element, type }) => {
            if (isSlatePluginElement(element as HTMLElement, type)) {
              return;
            }

            return {
              type: plugin.node.type,
              url: element.getAttribute('src'),
            };
          },
          rules: [
            {
              validNodeName: 'IMG',
            },
          ],
        },
      },
    },
  }));
