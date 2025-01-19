import axios from 'axios';
import { useEffect, useRef } from 'react';
import '@mdxeditor/editor/style.css';
import {
  MDXEditor,
  MDXEditorMethods,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
  imagePlugin,
  InsertImage,
  BlockTypeSelect,
  ListsToggle,
  CodeToggle,
  InsertTable,
  tablePlugin,
  markdownShortcutPlugin,
} from '@mdxeditor/editor';

async function imageUploadHandler(file: any) {
  try {
    if (!file) throw new Error('File does not exist');

    const payload = new FormData();
    payload.append('file', file);

    const uploadResponse = await axios.post('/api/uploadFile', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return uploadResponse.data.url;
  } catch (err) {
    return '';
  }
}

type EditorProps = {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
};

function Editor({ value, onValueChange, className = '' }: EditorProps) {
  const ref = useRef<MDXEditorMethods>(null);

  useEffect(() => {
    let htmlTags = /<[^>]*>?/g;
    let cleanValue = value.replace(htmlTags, '');
    ref.current?.setMarkdown(cleanValue);
  }, [value]);

  return (
    <>
      <MDXEditor
        className={`prose prose-sm w-full rounded-md border dark:prose-invert md:min-w-full ${className}`}
        ref={ref}
        markdown={value} //default value
        onChange={(markdown) => {
          onValueChange(markdown);
        }}
        plugins={[
          toolbarPlugin({
            toolbarClassName: 'w-full overflow-x-auto',
            toolbarContents: () => (
              <div className="flex w-full flex-wrap gap-2">
                <UndoRedo />
                <BlockTypeSelect />
                <BoldItalicUnderlineToggles />
                <InsertImage />
                <ListsToggle options={['number', 'bullet']} />
                <InsertTable />
              </div>
            ),
          }),
          headingsPlugin({
            allowedHeadingLevels: [2, 3, 4],
          }),
          quotePlugin(),
          listsPlugin({ allowedLists: ['numbered', 'bullet'] }),
          thematicBreakPlugin(),
          imagePlugin({ imageUploadHandler }),
          tablePlugin(),
          markdownShortcutPlugin(),
        ]}
      />
    </>
  );
}

export default Editor;
