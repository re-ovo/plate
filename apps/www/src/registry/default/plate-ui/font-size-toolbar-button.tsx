'use client';
import { useState } from 'react';

import { cn } from '@udecode/cn';
import { type TElement, getAboveNode, getMarks } from '@udecode/plate-common';
import {
  focusEditor,
  useEditorPlugin,
  useEditorSelector,
} from '@udecode/plate-common/react';
import { BaseFontSizePlugin, toUnitLess } from '@udecode/plate-font';
import { FontSizePlugin } from '@udecode/plate-font/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { Minus, Plus } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { ToolbarButton } from './toolbar';

const DEFAULT_FONT_SIZE = '16';

const FONT_SIZE_MAP = {
  [HEADING_KEYS.h1]: '36',
  [HEADING_KEYS.h2]: '24',
  [HEADING_KEYS.h3]: '20',
} as const;

const FONT_SIZES = [
  '8',
  '9',
  '10',
  '12',
  '14',
  '16',
  '18',
  '24',
  '30',
  '36',
  '48',
  '60',
  '72',
  '96',
] as const;

export function FontSizeToolbarButton() {
  const [inputValue, setInputValue] = useState(DEFAULT_FONT_SIZE);
  const [isFocused, setIsFocused] = useState(false);
  const { api, editor } = useEditorPlugin(BaseFontSizePlugin);
  const setMark = api.fontSize.setMark;

  const cursorFontSize = useEditorSelector((editor) => {
    const marks = getMarks(editor);
    const fontSize = marks?.[FontSizePlugin.key];

    if (fontSize) {
      return toUnitLess(fontSize as string);
    }

    const [node] =
      getAboveNode<TElement>(editor, {
        at: editor.selection?.focus,
      }) || [];

    return node?.type && node.type in FONT_SIZE_MAP
      ? FONT_SIZE_MAP[node.type as keyof typeof FONT_SIZE_MAP]
      : DEFAULT_FONT_SIZE;
  }, []);

  const handleInputChange = () => {
    const newSize = toUnitLess(inputValue);

    if (Number.parseInt(newSize) < 1 || Number.parseInt(newSize) > 100) {
      focusEditor(editor);

      return;
    }
    if (newSize !== toUnitLess(cursorFontSize)) {
      setMark(`${newSize}px`);
    }

    focusEditor(editor);
  };

  const handleFontSizeChange = (delta: number) => {
    const newSize = Number(displayValue) + delta;
    setMark(`${newSize}px`);
    focusEditor(editor);
  };

  const displayValue = isFocused ? inputValue : cursorFontSize;

  return (
    <div className="flex h-7 items-center gap-1 rounded-md bg-muted/60 p-0 ">
      <ToolbarButton onClick={() => handleFontSizeChange(-1)}>
        <Minus />
      </ToolbarButton>

      <Popover open={isFocused} modal={false}>
        <PopoverTrigger asChild>
          <input
            className={cn(
              'h-full w-10 shrink-0 bg-transparent px-1 text-center text-sm hover:bg-muted'
            )}
            value={displayValue}
            onBlur={() => {
              setIsFocused(false);
              handleInputChange();
            }}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={(e) => {
              setIsFocused(true);
              setInputValue(toUnitLess(cursorFontSize));
              e.target.select();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleInputChange();
              }
            }}
            data-plate-focus="true"
            type="text"
          />
        </PopoverTrigger>
        <PopoverContent
          className="w-10 px-px py-1"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {FONT_SIZES.map((size) => (
            <button
              key={size}
              className={cn(
                'flex h-8 w-full items-center justify-center  text-sm hover:bg-accent data-[highlighted=true]:bg-accent'
              )}
              onClick={() => {
                setMark(`${size}px`);
                setIsFocused(false);
              }}
              data-highlighted={size === displayValue}
              type="button"
            >
              {size}
            </button>
          ))}
        </PopoverContent>
      </Popover>

      <ToolbarButton onClick={() => handleFontSizeChange(1)}>
        <Plus />
      </ToolbarButton>
    </div>
  );
}
