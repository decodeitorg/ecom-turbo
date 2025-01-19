import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import "@mdxeditor/editor/style.css";
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
} from "@mdxeditor/editor";
import { getApiUrl } from "@/lib/utils";

async function imageUploadHandler(file: any) {
    try {
        if (!file) throw new Error("File does not exist");

        const payload = new FormData();
        payload.append("file", file);

        const uploadResponse = await axios.post(
            getApiUrl() + "/api/uploadFile",
            payload,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return uploadResponse.data.url;
    } catch (err) {
        return "";
    }
}

function ProductDescription({ formik, name, title }) {
    const ref = useRef<MDXEditorMethods>(null);

    useEffect(() => {
        let description = formik.values[name] || "";
        let htmlTags = /<[^>]*>?/g;
        let cleanDescription = description.replace(htmlTags, "");

        ref.current?.setMarkdown(cleanDescription);
    }, [formik.values[name]]);

    return (
        <div className="w-full overflow-x-auto">
            <div className="flex w-full items-center justify-between">
                <h4 className="w-full font-semibold text-slate-500">{title}</h4>
                {/* <Button variant="outline">Edit</Button> */}
            </div>

            <MDXEditor
                className="w-full rounded-md border md:min-w-full"
                contentEditableClassName="prose prose-sm dark:prose-invert min-w-full"
                ref={ref}
                markdown={formik.values[name]} //default value
                onChange={(markdown) => {
                    formik.setFieldValue(name, markdown);
                }}
                plugins={[
                    toolbarPlugin({
                        toolbarClassName:
                            "w-full overflow-x-auto dark:bg-gray-300",
                        toolbarContents: () => (
                            <div className="flex flex-wrap items-center justify-start gap-2 overflow-x-auto p-2">
                                <UndoRedo />
                                <BlockTypeSelect />
                                <BoldItalicUnderlineToggles />
                                <InsertImage />
                                <ListsToggle options={["number", "bullet"]} />
                                <InsertTable />
                            </div>
                        ),
                    }),
                    headingsPlugin({
                        allowedHeadingLevels: [2, 3, 4],
                    }),
                    quotePlugin(),
                    listsPlugin({ allowedLists: ["numbered", "bullet"] }),
                    thematicBreakPlugin(),
                    imagePlugin({ imageUploadHandler }),
                    tablePlugin(),
                    markdownShortcutPlugin(),
                ]}
            />
        </div>
    );
}

export default ProductDescription;
