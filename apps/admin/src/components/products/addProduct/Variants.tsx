import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.tsx";

import { MultiSelect } from "@/components/ui/multi-select";
import { useEffect, useState } from "react";

import FileUpload from "@/components/common/Upload.tsx";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx";

import { Settings2 } from "lucide-react";
import { Attribute, Product, ProductVariant } from "@/lib/types.ts";

import { FormikProps } from "formik";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { Label } from "@/components/ui/label.tsx";
import { populateVariantsAttributes } from "@/lib/function.ts";
import useDeepCompareEffect from "@/hooks/useDeepCompareEffect";
import { Checkbox } from "@/components/ui/checkbox";

export default function Variants({
    formik,
    attributes,
}: {
    formik: FormikProps<Product>;
    attributes: Attribute[];
}) {
    useDeepCompareEffect(() => {
        if (!attributes?.length) return;

        const generateVariantCombinations = (
            attributes: Attribute[]
        ): any[] => {
            console.log(
                "🚀 ~ generateVariantCombinations ~ attributes:",
                attributes
            );
            if (!attributes || attributes.length === 0) return [];

            const first = attributes?.[0];
            const rest = attributes.slice(1);

            const combinations = first.variants.flatMap((variant) => {
                if (!variant) return [];
                const remainingCombinations = generateVariantCombinations(rest);
                return remainingCombinations.length > 0
                    ? remainingCombinations.map((combo: any) => ({
                          ...combo,
                          [first._id]: variant._id,
                      }))
                    : [{ [first._id]: variant._id }];
            });
            return combinations;
        };

        let variantsAttributesPopulated = populateVariantsAttributes(
            attributes,
            formik.values.variantsAttributes
        );

        const combinations = generateVariantCombinations(
            variantsAttributesPopulated
        );

        const newVariants = combinations.map((combo, index) => {
            const existingVariant = formik.values.variants.find((variant) => {
                return Object.entries(combo).every(
                    ([key, value]) => variant[key] === value
                );
            });

            if (existingVariant) {
                return {
                    ...combo,
                    price: existingVariant.price,
                    salePrice: existingVariant.salePrice,
                    extraDeliveryCharge: existingVariant.extraDeliveryCharge,
                    isHomeDeliveryFree: existingVariant.isHomeDeliveryFree,
                    id: index + 1,
                    images: existingVariant.images || [],
                    status: existingVariant.status,
                };
            } else {
                return {
                    ...combo,
                    price: 0,
                    salePrice: 0,
                    extraDeliveryCharge: 0,
                    isHomeDeliveryFree: false,
                    status: "outOfStock",
                    images: [],
                    id: index + 1,
                };
            }
        });

        formik.setFieldValue("variants", newVariants);
    }, [formik.values.variantsAttributes, attributes]);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex justify-between">
                    Variation
                    <ConfigureVariants
                        formik={formik}
                        attributes={attributes}
                    />
                </CardTitle>
                <CardDescription>
                    Add variants details for your product
                </CardDescription>
            </CardHeader>
            <CardContent>
                <GereratorVariantsInput
                    formik={formik}
                    attributes={attributes}
                />
                <GeneratorVariantsImageInput
                    formik={formik}
                    attributes={attributes}
                />

                {/* <Tags
            attributes={attributes}
            formik={formik}
            setCurrentTab={setCurrentTab}
            prevTab={prevTab}
          /> */}
            </CardContent>
            {/* <CardFooter className="justify-center border-t p-4">
        <Button size="sm" variant="ghost" className="gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          Add Variant
        </Button>
      </CardFooter> */}
        </Card>
    );
}

function ConfigureVariants({
    formik,
    attributes,
}: {
    formik: FormikProps<Product>;
    attributes: Attribute[];
}) {
    const [open, setOpen] = useState(false);

    if (!attributes?.length) return null;
    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Settings2 size={16} />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Configure Variants</DialogTitle>
                        <DialogDescription>
                            Select the attributes and variants for your product
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <MultiSelect
                            options={attributes?.map((attribute) => ({
                                value: attribute._id,
                                label: attribute.name,
                                ...attribute,
                            }))}
                            defaultValue={Object.keys(
                                formik.values.variantsAttributes
                            )}
                            placeholder="Select a Variant"
                            className="w-full"
                            onValueChange={(selectedList) => {
                                try {
                                    let oldVariantsAttributes =
                                        formik.values.variantsAttributes;

                                    let newVariantsAttributesObj =
                                        selectedList.reduce((acc, curr) => {
                                            if (!oldVariantsAttributes[curr]) {
                                                acc[curr] = [];
                                            } else {
                                                acc[curr] =
                                                    oldVariantsAttributes[curr];
                                            }
                                            return acc;
                                        }, {});

                                    formik.setFieldValue(
                                        "variantsAttributes",
                                        newVariantsAttributesObj
                                    );
                                } catch (error) {
                                    console.error(error);
                                }
                            }}
                        />

                        <h2 className="mt-3 font-semibold">Select Variants</h2>
                        <VariantsGenerate
                            formik={formik}
                            attributes={attributes}
                        />

                        <h2 className="mt-3 font-semibold">
                            Select Variants For Image
                        </h2>
                        <ImageVariantGenerator
                            formik={formik}
                            attributes={attributes}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            Done
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

function VariantsGenerate({
    formik,
    attributes,
}: {
    formik: FormikProps<Product>;
    attributes: Attribute[];
}) {
    return (
        <div className="flex flex-wrap">
            {Object.keys(formik.values?.variantsAttributes).map(
                (attribute_id) => {
                    let attribute = attributes?.find(
                        (attr) => attr._id === attribute_id
                    );
                    if (!attribute) return null;
                    return (
                        <div className="flex w-full" key={attribute_id}>
                            <MultiSelect
                                options={attribute.variants.map((variant) => ({
                                    value: variant._id,
                                    label: variant.name,
                                }))}
                                defaultValue={
                                    formik.values.variantsAttributes[
                                        attribute_id
                                    ]
                                }
                                onValueChange={(values) => {
                                    let newVariantsAttributes =
                                        formik.values.variantsAttributes;
                                    newVariantsAttributes[attribute_id] =
                                        values;
                                    formik.setFieldValue(
                                        "variantsAttributes",
                                        newVariantsAttributes
                                    );
                                }}
                                placeholder={`Select ${attribute.name}`}
                                className="w-full"
                            />
                        </div>
                    );
                }
            )}
        </div>
    );
}

const ImageVariantGenerator = ({
    formik,
    attributes,
}: {
    formik: FormikProps<Product>;
    attributes: Attribute[];
}) => {
    let variantsAttributesPopulated = populateVariantsAttributes(
        attributes,
        formik.values.variantsAttributes
    );

    return (
        <>
            <RadioGroup
                value={formik.values.imageVariant.type}
                onValueChange={(value) => {
                    formik.setFieldValue("imageVariant.type", value);
                }}
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="same" id="r1" />
                    <Label htmlFor="r1">Same Image for all Variants</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="different" id="r2" />
                    <Label htmlFor="r2">Different Image for each Variant</Label>
                </div>
            </RadioGroup>

            {formik.values.imageVariant.type === "different" && (
                <div className="flex items-center justify-between">
                    <Select
                        value={formik.values.imageVariant.variantId}
                        onValueChange={(value) =>
                            formik.setFieldValue(
                                "imageVariant.variantId",
                                value
                            )
                        }
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a Variant for Image" />
                        </SelectTrigger>
                        <SelectContent>
                            {variantsAttributesPopulated?.map((attribute) => (
                                <SelectItem
                                    key={attribute._id}
                                    value={attribute._id}
                                >
                                    {attribute.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
        </>
    );
};

function GereratorVariantsInput({
    formik,
    attributes,
}: {
    formik: FormikProps<Product>;
    attributes: Attribute[];
}) {
    const getVariantName = (variant: ProductVariant) => {
        let byId = (_id) => {
            let variant = attributes
                ?.map((attribute) => attribute.variants)
                .flat()
                ?.find((variant) => variant._id === _id);

            return variant?.name;
        };

        let name = [];

        Object.entries(variant)?.map(([key, value], i) =>
            name.push(byId(value))
        );

        return name.filter((n) => n).join(" - ");
    };

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const numericValue = parseInt(value);
        let newVariants = formik.values.variants.map((input, i) =>
            i === index ? { ...input, [name]: numericValue } : input
        );
        formik.setFieldValue("variants", newVariants);
    };

    const statusOptions = ["upcoming", "inStock", "outOfStock"];

    const getStatusColor = (status) => {
        switch (status) {
            case "upcoming":
                return "text-yellow-700 bg-yellow-200";
            case "inStock":
                return "text-green-700 bg-green-200";
            case "outOfStock":
                return "text-red-700 bg-red-200";
            default:
                return "";
        }
    };

    return (
        <>
            <div className="mb-3 rounded border p-3 shadow-md">
                <div className="flex flex-col justify-between gap-2 md:flex-row">
                    <div className="my-auto w-52 text-center font-semibold">
                        All At Once
                    </div>
                    <div className="flex gap-3">
                        <Input
                            required
                            type="number"
                            onChange={(e) => {
                                let variants = formik.values.variants.map(
                                    (variant) => {
                                        return {
                                            ...variant,
                                            price: e.target.value,
                                        };
                                    }
                                );
                                formik.setFieldValue("variants", variants);
                            }}
                            name={"price"}
                            placeholder={"price"}
                            className="w-full"
                        />
                        <Input
                            type="number"
                            onChange={(e) => {
                                let variants = formik.values.variants.map(
                                    (variant) => {
                                        return {
                                            ...variant,
                                            salePrice: e.target.value,
                                        };
                                    }
                                );
                                formik.setFieldValue("variants", variants);
                            }}
                            name={"salePrice"}
                            placeholder={"Sale Price"}
                            className="w-full"
                        />

                        {/* free home delivery checkbox */}
                        <div className="flex items-center gap-1">
                            <Checkbox
                                onCheckedChange={(checked) => {
                                    let variants = formik.values.variants.map(
                                        (variant, i) => {
                                            return {
                                                ...variant,
                                                isHomeDeliveryFree: checked,
                                            };
                                        }
                                    );
                                    formik.setFieldValue("variants", variants);
                                }}
                            />
                            <Label>Free Home Delivery</Label>
                        </div>

                        <Input
                            required
                            type="number"
                            min={0}
                            onChange={(e) => {
                                let variants = formik.values.variants.map(
                                    (variant, i) => {
                                        return {
                                            ...variant,
                                            extraDeliveryCharge: e.target.value,
                                        };
                                    }
                                );
                                formik.setFieldValue("variants", variants);
                            }}
                            name={"extraDeliveryCharge"}
                            placeholder={"Extra Delivery Charge"}
                            className="w-full"
                        />
                    </div>
                    <div className="flex gap-3">
                        <Select
                            onValueChange={(newValue) => {
                                let newVariants = formik.values.variants.map(
                                    (input) => {
                                        return {
                                            ...input,
                                            status: newValue,
                                        };
                                    }
                                );
                                formik.setFieldValue("variants", newVariants);
                            }}
                        >
                            <SelectTrigger className="w-36">
                                <SelectValue placeholder="Select Store" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        <span
                                            className={`rounded-md p-1 ${getStatusColor(status)}`}
                                        >
                                            {status}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {formik.values.variants?.map((variant, index) => (
                <div key={variant.id} className="my-2 border-b p-1">
                    <div className="mb-4 flex flex-col justify-between gap-2 md:flex-row">
                        <div className="my-auto w-52 text-center">
                            {getVariantName(variant)}
                        </div>
                        <div className="flex gap-3">
                            <Input
                                required
                                type="number"
                                onChange={(e) => handleInputChange(e, index)}
                                name={"price"}
                                value={variant.price}
                                placeholder={"price"}
                                className="w-full"
                            />
                            <Input
                                type="number"
                                onChange={(e) => handleInputChange(e, index)}
                                name={"salePrice"}
                                value={variant.salePrice}
                                placeholder={"salePrice"}
                                className="w-full"
                            />

                            {/* free home delivery checkbox */}
                            <div className="flex items-center gap-1">
                                <Checkbox
                                    onCheckedChange={(checked) => {
                                        let newVariants =
                                            formik.values.variants.map(
                                                (input, i) => {
                                                    return i === index
                                                        ? {
                                                              ...input,
                                                              isHomeDeliveryFree:
                                                                  checked,
                                                          }
                                                        : input;
                                                }
                                            );
                                        formik.setFieldValue(
                                            "variants",
                                            newVariants
                                        );
                                    }}
                                    checked={!!variant.isHomeDeliveryFree}
                                />
                                <Label>Free Home Delivery</Label>
                            </div>

                            <Input
                                required
                                type="number"
                                onChange={(e) => handleInputChange(e, index)}
                                name={"extraDeliveryCharge"}
                                value={variant.extraDeliveryCharge}
                                placeholder={"Extra Delivery Charge"}
                                className="w-full"
                            />
                        </div>
                        <div className="flex gap-3">
                            <Select
                                value={variant.status}
                                onValueChange={(newValue) => {
                                    let newVariants =
                                        formik.values.variants.map(
                                            (input, i) => {
                                                return i === index
                                                    ? {
                                                          ...input,
                                                          status: newValue,
                                                      }
                                                    : input;
                                            }
                                        );
                                    formik.setFieldValue(
                                        "variants",
                                        newVariants
                                    );
                                }}
                            >
                                <SelectTrigger className="w-36">
                                    <SelectValue placeholder="Select Store" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            <span
                                                className={`rounded-md p-1 ${getStatusColor(status)}`}
                                            >
                                                {status}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

function GeneratorVariantsImageInput({
    formik,
    attributes,
}: {
    formik: FormikProps<Product>;
    attributes: Attribute[];
}) {
    const [images, setImages] = useState({});

    let imageVariant = formik.values.imageVariant;
    let variants = formik.values.variants;

    const [selectedAttribute, setSelectedAttribute] = useState<Attribute>();

    useDeepCompareEffect(() => {
        let populatedAttributes = populateVariantsAttributes(
            attributes,
            formik.values.variantsAttributes
        );

        let selctedAttribute = populatedAttributes?.find(
            (attr) => attr._id === imageVariant?.variantId
        );

        setSelectedAttribute(selctedAttribute);
    }, [
        formik.values.variantsAttributes,
        formik.values.imageVariant,
        attributes,
    ]);

    useDeepCompareEffect(() => {
        //this attriute represents the selected attribute by which image is differ
        selectedAttribute?.variants.map((att_variant) => {
            if (!att_variant) return null;

            let imageVariant = variants?.find((variant) => {
                if (variant[selectedAttribute._id] === att_variant._id)
                    return variant;
            });

            // images[att_variant._id] =  imageVariant?.images;
            setImages((prev) => {
                return {
                    ...prev,
                    [att_variant._id]: imageVariant?.images,
                };
            });
        });
    }, [
        formik.values.variants,
        formik.values.variantsAttributes,
        selectedAttribute,
    ]);

    return (
        <>
            {formik.values.imageVariant.type === "same" ? (
                <>
                    <FileUpload
                        value={formik.values.variants[0]?.images}
                        title="Images for all variants"
                        description="Upload images for all variants"
                        onChange={(value) => {
                            let newVariants = formik.values.variants.map(
                                (input) => {
                                    return {
                                        ...input,
                                        images: value,
                                    };
                                }
                            );
                            formik.setFieldValue("variants", newVariants);
                        }}
                        type="multiple"
                        allowedFileTypes={[".png", ".jpg", ".jpeg", ".webp"]}
                        className="w-full"
                    />
                </>
            ) : (
                <>
                    {selectedAttribute?.variants.map((variant) => {
                        if (!variant) return null;
                        return (
                            <div className="">
                                <FileUpload
                                    title="Images for variant"
                                    description={variant.name}
                                    value={images[variant._id]}
                                    onChange={(value) => {
                                        let newVariants =
                                            formik.values.variants.map(
                                                (input) => {
                                                    if (
                                                        input[
                                                            selectedAttribute
                                                                ._id
                                                        ] === variant._id
                                                    ) {
                                                        return {
                                                            ...input,
                                                            images: value,
                                                        };
                                                    }
                                                    return input;
                                                }
                                            );
                                        formik.setFieldValue(
                                            "variants",
                                            newVariants
                                        );
                                    }}
                                    type="multiple"
                                    allowedFileTypes={[".png", ".jpg", ".jpeg"]}
                                    className="w-full"
                                    key={variant._id}
                                />
                            </div>
                        );
                    })}
                </>
            )}
        </>
    );
}
