import type { HtmlDeserializer } from '@udecode/plate';

import {
  BaseCodeBlockPlugin,
  BaseCodeLinePlugin,
} from '../BaseCodeBlockPlugin';
import { htmlDeserializerCodeBlockStatic } from './htmlDeserializerCodeBlockStatic';

export const htmlDeserializerCodeBlock: HtmlDeserializer = {
  parse: ({ element }) => {
    const staticCodeBlock = htmlDeserializerCodeBlockStatic(element);

    if (staticCodeBlock) {
      return staticCodeBlock;
    }

    const languageSelectorText =
      [...element.childNodes].find(
        (node: ChildNode) => node.nodeName === 'SELECT'
      )?.textContent || '';

    const textContent =
      element.textContent?.replace(languageSelectorText, '') || '';

    let lines = textContent.split('\n');

    if (!lines?.length) {
      lines = [textContent];
    }

    const codeLines = lines.map((line) => ({
      children: [{ text: line }],
      type: BaseCodeLinePlugin.key,
    }));

    return {
      children: codeLines,
      type: BaseCodeBlockPlugin.key,
    };
  },
  rules: [
    {
      validNodeName: 'PRE',
    },
    {
      validNodeName: 'P',
      validStyle: {
        fontFamily: 'Consolas',
      },
    },
  ],
};
