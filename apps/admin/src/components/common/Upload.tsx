import axios from "axios";
import React, { useState } from "react";
import type { FC } from "react";
import { useDropzone } from "react-dropzone";
import { Progress } from "@/components/ui/progress";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getApiUrl } from "@/lib/utils";

// type AllowedFileType = '.jpg' | '.jpeg' | '.png' | '.gif' | '.svg' | '.webp' | '.mp3' | '.wav' | '.mp4' | '.mov' | '.avi' | '.webm';
type AllowedFileType = ".jpg" | ".jpeg" | ".png" | ".webp";

type FileUploadProps = {
    type: "single" | "multiple";
    value: string | string[];
    onChange: (value: string | string[]) => void;
    allowedFileTypes: AllowedFileType[];
    maxFiles?: number;
    className?: string;
    title?: string;
    description?: string;
};

type FileState = {
    url?: string;
    progress: number;
    error?: string;
};

const SortableImage = ({
    url,
    index,
    onRemove,
    fileState,
}: {
    url: string;
    index: number;
    onRemove: (index: number) => void;
    fileState?: FileState;
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: url });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: "none",
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            className="relative"
            style={style}
            {...attributes}
            {...listeners}
        >
            <img
                alt={`Uploaded file ${index + 1}`}
                className="aspect-square w-full rounded-md object-contain hover:cursor-grab"
                height="84"
                src={url}
                width="84"
            />
            <div className="absolute right-1 top-1">
                <X
                    className="h-5 w-5 cursor-pointer rounded-full bg-background p-1 text-foreground opacity-40"
                    onClick={() => onRemove(index)}
                />
            </div>
            {fileState?.progress > 0 && (
                <Progress
                    aria-label="Uploading..."
                    value={fileState.progress}
                    color="success"
                    className="max-w-md"
                />
            )}
        </div>
    );
};

const FileUpload: FC<FileUploadProps> = ({
    value,
    onChange,
    type,
    allowedFileTypes,
    maxFiles = 5,
    className = "",
    title = "",
    description = "",
}) => {
    const [fileStates, setFileStates] = useState<FileState[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        setActiveId(null);

        console.log(
            "🚀 ~ handleDragEnd ~ active.id over.id:",
            active.id,
            over.id
        );
        if (over && active.id !== over.id) {
            const oldIndex = (value as string[]).indexOf(active.id);
            const newIndex = (value as string[]).indexOf(over.id);
            const newOrder = arrayMove(value as string[], oldIndex, newIndex);
            onChange([...newOrder]);
        }
    };

    async function uploadImage(file: any, index: number) {
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
                    onUploadProgress: (progressEvent) => {
                        const { loaded, total } = progressEvent;
                        let percent = Math.floor(
                            (loaded * 100) / (total?.valueOf() || 1)
                        );
                        setFileStates((prevStates) => {
                            const newStates = [...prevStates];
                            newStates[index] = {
                                ...newStates[index],
                                progress: percent,
                            };
                            return newStates;
                        });
                    },
                }
            );

            const uploadResponseData = await uploadResponse.data;
            return uploadResponseData.url;
        } catch (err: any) {
            setFileStates((prevStates) => {
                const newStates = [...prevStates];
                newStates[index] = { ...newStates[index], error: err.message };
                return newStates;
            });
            return "";
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: getMimeTypes(allowedFileTypes),
        maxFiles: type === "multiple" ? maxFiles : 1,
        multiple: type === "multiple",
        onDrop: async (acceptedFiles) => {
            const initialStates = acceptedFiles.map(() => ({ progress: 0 }));
            setFileStates(initialStates);

            if (type === "multiple") {
                let urls = await Promise.all(
                    acceptedFiles.map(async (file, index) => {
                        let url = await uploadImage(file, index);
                        return url;
                    })
                );
                onChange([...(value as string[]), ...urls.filter(Boolean)]);
            } else {
                let url = await uploadImage(acceptedFiles[0], 0);
                onChange(url);
            }

            setFileStates([]);
        },
    });

    const removeFile = (index: number) => {
        if (type === "multiple") {
            let files = value as string[];
            files.splice(index, 1);
            onChange(files);
        } else {
            onChange("");
        }
    };

    return (
        <>
            <Card className="overflow-hidden">
                {title || description ? (
                    <CardHeader>
                        {title && <CardTitle>{title}</CardTitle>}
                        {description && (
                            <CardDescription>{description}</CardDescription>
                        )}
                    </CardHeader>
                ) : null}

                <CardContent
                    className={`${!title && !description ? "p-4" : ""}`}
                >
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                        {type === "multiple" &&
                            Array.isArray(value) &&
                            value?.length > 0 && (
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragStart={handleDragStart}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={value}
                                        strategy={rectSortingStrategy}
                                    >
                                        {(value as string[])?.map(
                                            (url, index) => (
                                                <SortableImage
                                                    key={url}
                                                    url={url}
                                                    index={index}
                                                    onRemove={removeFile}
                                                    fileState={
                                                        fileStates[index]
                                                    }
                                                />
                                            )
                                        )}
                                    </SortableContext>
                                    <DragOverlay adjustScale={true}>
                                        {activeId ? (
                                            <img
                                                src={activeId}
                                                alt="Dragging"
                                                className="aspect-square w-full rounded-md object-contain"
                                            />
                                        ) : null}
                                    </DragOverlay>
                                </DndContext>
                            )}
                        {type === "single" && value && (
                            <div className="relative">
                                <img
                                    alt="Uploaded file"
                                    className="aspect-square w-full rounded-md object-contain"
                                    height="84"
                                    src={value as string}
                                    width="84"
                                />

                                <div className="absolute right-1 top-1">
                                    <X
                                        className="h-5 w-5 cursor-pointer rounded-full bg-background p-1 text-foreground opacity-40"
                                        onClick={() => {
                                            removeFile(0);
                                        }}
                                    />
                                </div>
                                {fileStates[0] &&
                                    fileStates[0].progress > 0 && (
                                        <Progress
                                            aria-label="Uploading..."
                                            value={fileStates[0].progress}
                                            color="success"
                                            className="max-w-md"
                                        />
                                    )}
                            </div>
                        )}
                        <div
                            className="flex aspect-square w-full cursor-pointer items-center justify-center rounded-md border border-dashed"
                            {...getRootProps()}
                        >
                            <input {...getInputProps()} />
                            <Upload className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {fileStates.length > 0 &&
                fileStates.map((fileState, index) =>
                    fileState.progress > 0 ? (
                        <Progress
                            key={index}
                            aria-label="Uploading..."
                            size="md"
                            value={fileState.progress}
                            color="success"
                            showValueLabel={true}
                            className="max-w-md"
                        />
                    ) : null
                )}
        </>
    );
};

function getMimeTypes(allowedFileTypes: string[]) {
    let accept = {};
    allowedFileTypes.forEach((fileType) => {
        switch (fileType) {
            case ".jpg":
            case ".jpeg":
                accept = { ...accept, "image/jpeg": [".jpg", ".jpeg"] };
                break;
            case ".png":
                accept = { ...accept, "image/png": [".png"] };
                break;
            case ".gif":
                accept = { ...accept, "image/gif": [".gif"] };
                break;
            case ".svg":
                accept = { ...accept, "image/svg+xml": [".svg"] };
                break;
            case ".webp":
                accept = { ...accept, "image/webp": [".webp"] };
                break;
            case ".mp3":
                accept = { ...accept, "audio/mpeg": [".mp3"] };
                break;
            case ".wav":
                accept = { ...accept, "audio/wav": [".wav"] };
                break;
            case ".mp4":
                accept = { ...accept, "video/mp4": [".mp4"] };
                break;
            case ".mov":
                accept = { ...accept, "video/quicktime": [".mov"] };
                break;
            case ".avi":
                accept = { ...accept, "video/x-msvideo": [".avi"] };
                break;
            case ".webm":
                accept = { ...accept, "video/webm": [".webm"] };
                break;
            default:
                break;
        }
    });
    return accept;
}

export default FileUpload;
