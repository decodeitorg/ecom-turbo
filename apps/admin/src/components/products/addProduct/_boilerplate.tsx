import React from 'react'
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  diffSourcePlugin,
  markdownShortcutPlugin,
  AdmonitionDirectiveDescriptor,
  DirectiveDescriptor,
  directivesPlugin,
  frontmatterPlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  KitchenSinkToolbar
} from '@mdxeditor/editor'




export async function expressImageUploadHandler(image: File) {
  const formData = new FormData()
  formData.append('image', image)
  const response = await fetch('/uploads/new', { method: 'POST', body: formData })
  const json = (await response.json()) as { url: string }
  return json.url
}


export const YoutubeDirectiveDescriptor: DirectiveDescriptor = {
  name: 'youtube',
  type: 'leafDirective',
  testNode(node) {
    return node.name === 'youtube'
  },
  attributes: ['id'],
  hasChildren: false,
  Editor: ({ mdastNode, lexicalNode, parentEditor }) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <button
          onClick={() => {
            parentEditor.update(() => {
              lexicalNode.selectNext()
              lexicalNode.remove()
            })
          }}
        >
          delete
        </button>
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${mdastNode.attributes.id}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>
      </div>
    )
  }
}

export const ALL_PLUGINS = [
  toolbarPlugin({ toolbarContents: () => <KitchenSinkToolbar /> }),
  // listsPlugin(),
  // quotePlugin(),
  headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
  // linkPlugin(),
  // linkDialogPlugin(),
  // imagePlugin({
  //   imageAutocompleteSuggestions: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  //   imageUploadHandler: async () => Promise.resolve('https://picsum.photos/200/300')
  // }),
  // tablePlugin(),
  // thematicBreakPlugin(),
  // frontmatterPlugin(),
  // codeBlockPlugin({ defaultCodeBlockLanguage: '' }),
  // codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS', txt: 'Plain Text', tsx: 'TypeScript', '': 'Unspecified' } }),
  // directivesPlugin({ directiveDescriptors: [YoutubeDirectiveDescriptor, AdmonitionDirectiveDescriptor] }),
  // diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: 'boo' }),
  // markdownShortcutPlugin()
]
