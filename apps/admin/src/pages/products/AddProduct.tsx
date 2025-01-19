import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useStore } from "@nanostores/react";
import { $categories } from "@/store/categories";
import { useEffect, useState } from "react";
import { postData, putData, useFetchData } from "@/hooks/hook";
import { useFormik } from "formik";
import { Switch } from "@/components/ui/switch";
import FileUpload from "@/components/common/Upload";
import Variants from "@/components/products/addProduct/Variants";
import { Attribute, Product } from "@/lib/types";
import { useParams } from "react-router-dom";
import {
    $attributes,
    $attributesError,
    $attributesLoading,
} from "@/store/attributes";
import { Textarea } from "@/components/ui/textarea";
import ProductDescription from "@/components/products/addProduct/ProductDescription";
import Breadcamb from "@/layout/Breadcamb";
import { getYoutubeEmbedUrl } from "@/lib/youtube";
import { Checkbox } from "@/components/ui/checkbox";

let initialValues: Product = {
    name: "",
    slug: "",
    shortDescription: "",
    useYoutube: false,
    youtubeLink: "",
    description: "",
    faq: [],
    category: "",
    subCategory: "",
    leafCategory: "",
    images: [],
    price: 0,
    salePrice: 0,
    isHomeDeliveryFree: false,
    hasStock: false,
    stock: 0,
    hasVariants: false,
    variantsAttributes: {},
    variants: [],
    imageVariant: {
        type: "same",
        variantId: "",
    },
    status: "inStock",
};

export default function AddProduct() {
    let { _id } = useParams();

    let [product, getProduct] = useFetchData(
        `/api/admin/products/product`,
        {
            _id,
        },
        false
    );

    const formik = useFormik({
        initialValues,

        onSubmit: async (values: any) => {
            values.price = parseInt(values.price);
            values.salePrice = parseInt(values.salePrice);
            values.stock = parseInt(values.stock);

            let variants = values?.variants;

            if (Array.isArray(variants) && variants.length > 0) {
                variants = variants.map((item: any) => {
                    return {
                        ...item,
                        price: parseInt(item.price ?? 0),
                        salePrice: parseInt(item.salePrice ?? 0),
                        stock: parseInt(item.stock ?? 0),
                    };
                });
            }
            values.variants = variants;
            if (_id) await putData(`/api/admin/products/product`, values);
            else {
                let res = await postData("/api/admin/products/product", values);
            }
        },
    });

    useEffect(() => {
        if (!!_id) {
            getProduct();
        } else {
            formik.resetForm();
        }
    }, [_id]);

    useEffect(() => {
        if (product && _id) {
            formik.setValues({
                ...product,
                attributes: product?.attributes || {},
            });
        } else {
            formik.resetForm();
        }
    }, [product, _id]);

    //--------For Edit Product--------

    let categories: Attribute[] = useStore($categories);

    const [subCategories, setSubCategories] = useState([]);
    const [leafCategories, setLeafCategories] = useState([]);

    const attributes: Attribute[] = useStore($attributes);
    const attributesLoading = useStore($attributesLoading);
    const attributesError = useStore($attributesError);

    useEffect(() => {
        if (formik.values.category) {
            const selectedCategory = categories?.find(
                (cat) => cat._id === formik.values.category
            );
            setSubCategories(selectedCategory?.children ?? []);
        } else {
            formik.setFieldValue("subCategory", "");
            formik.setFieldValue("leafCategory", "");
            setSubCategories([]);
            setLeafCategories([]);
        }
    }, [formik.values.category, categories]);

    useEffect(() => {
        if (formik.values.subCategory) {
            const selectedSubCategory = subCategories.find(
                (cat) => cat._id === formik.values.subCategory
            );
            setLeafCategories(selectedSubCategory?.children ?? []);
        } else {
            formik.setFieldValue("leafCategory", "");
            setLeafCategories([]);
        }
    }, [formik.values.subCategory, subCategories]);

    if (attributesLoading) return <div>Loading...</div>;
    if (attributesError) return <div>Error: {attributesError}</div>;

    return (
        <div className="max-f-full">
            <Breadcamb
                items={[
                    { label: "Products Management", path: "/admin/products" },
                    { label: "Add Product" },
                ]}
            />

            {/* SaveButtons */}
            <div className="flex items-center gap-4">
                <div>
                    <CardTitle>
                        {_id ? "Edit Product" : "Add Product"}
                    </CardTitle>
                    <CardDescription>
                        {_id
                            ? "Edit the product details, and save."
                            : "Add a new product. Fill in the details and save."}
                    </CardDescription>
                </div>
                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            history.back();
                        }}
                    >
                        Discard
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => {
                            formik.handleSubmit();
                        }}
                    >
                        Save Product
                    </Button>
                </div>
            </div>
            {/* Product Details */}
            <div className="mt-4 grid w-full grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
                {/* Product Details , Category ,Name ,Slug , Youtube , Price , Status , Images */}
                <div className="w-full space-y-4">
                    <div className="grid max-w-full gap-6">
                        {/* Product Category */}
                        <div className="flex items-center justify-between gap-4">
                            <div className="w-full">
                                <div className="grid max-w-full gap-6">
                                    <div className="maxw-full grid gap-3">
                                        <Label>Select Category</Label>

                                        <Select
                                            onValueChange={(value) => {
                                                formik.setFieldValue(
                                                    "category",
                                                    value
                                                );
                                            }}
                                            value={formik.values.category}
                                            defaultValue={formik.values.value}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories?.map((category) => {
                                                    return (
                                                        <SelectItem
                                                            key={category._id}
                                                            value={category._id}
                                                        >
                                                            {category.name}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            {formik.values.category &&
                                subCategories.length > 0 && (
                                    <div className="w-full">
                                        <Label>Select Category</Label>
                                        <Select
                                            onValueChange={(value) => {
                                                formik.setFieldValue(
                                                    "subCategory",
                                                    value
                                                );
                                            }}
                                            value={formik.values.subCategory}
                                            defaultValue={
                                                formik.values.subCategory
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Sub-Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {subCategories?.map(
                                                    (subCategory) => (
                                                        <SelectItem
                                                            key={
                                                                subCategory._id
                                                            }
                                                            value={
                                                                subCategory._id
                                                            }
                                                        >
                                                            {subCategory.name}
                                                        </SelectItem>
                                                    )
                                                )}{" "}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                        </div>
                        {/* Product Name */}
                        <div className="maxw-full grid gap-3">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                className="w-full"
                                placeholder="Gamer Gear Pro Controller"
                                value={formik.values.name}
                                onChange={(e) => {
                                    formik.setFieldValue(
                                        "name",
                                        e.target.value
                                    );
                                }}
                            />
                        </div>
                        {/* Product Slug */}
                        <div className="grid gap-3">
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                type="text"
                                className="w-full"
                                placeholder="gamer-gear-pro-controller"
                                value={formik.values.slug}
                                onChange={(e) => {
                                    formik.setFieldValue(
                                        "slug",
                                        e.target.value
                                    );
                                }}
                            />
                        </div>
                        {/* Product Youtube Link */}
                        <div className="flex items-center justify-start gap-4">
                            <Switch
                                id="useYoutube"
                                checked={formik.values.useYoutube}
                                onCheckedChange={(value) => {
                                    formik.setFieldValue("useYoutube", value);
                                }}
                            />
                            <Label htmlFor="useYoutube">Use Youtube Link</Label>
                        </div>
                        {formik.values.useYoutube && (
                            <div className="flex items-center justify-between gap-4">
                                <div className="w-full">
                                    <Label htmlFor="youtubeLink">
                                        Youtube Link
                                    </Label>
                                    <Input
                                        id="youtubeLink"
                                        type="text"
                                        className="w-full"
                                        placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                        value={formik.values.youtubeLink}
                                        onChange={(e) => {
                                            formik.setFieldValue(
                                                "youtubeLink",
                                                e.target.value
                                            );
                                        }}
                                    />
                                </div>
                                <div className="w-full">
                                    {/* if youtube link is not empty then show the youtube icon */}
                                    {formik.values.youtubeLink && (
                                        <iframe
                                            src={getYoutubeEmbedUrl(
                                                formik.values.youtubeLink
                                            )}
                                            title="YouTube video player"
                                            className="my-auto w-full rounded-md object-contain hover:cursor-grab"
                                            allowFullScreen
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        ></iframe>
                                    )}
                                </div>
                            </div>
                        )}
                        {/* Product Short Description */}
                        <div className="grid max-w-full gap-3">
                            <ProductDescription
                                title="Short-Description"
                                formik={formik}
                                name={"shortDescription"}
                            />
                        </div>

                        {/* Choose if has variants */}
                        <>
                            <div className="flex items-center">
                                <Switch
                                    id="has_variants"
                                    checked={formik.values.hasVariants}
                                    onCheckedChange={(value) => {
                                        formik.setFieldValue(
                                            "hasVariants",
                                            value
                                        );
                                    }}
                                />
                                <Label className="ml-2" htmlFor="has_variants">
                                    Select if Has Variants
                                </Label>
                            </div>
                            {!formik.values.hasVariants ? (
                                <>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Price</CardTitle>
                                            <CardDescription>
                                                Price and sale price of the
                                                product.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="grid w-full items-center gap-1.5">
                                                    <Label>Price</Label>
                                                    <Input
                                                        key="price"
                                                        type="number"
                                                        value={
                                                            formik.values.price
                                                        }
                                                        onChange={(e) => {
                                                            const value =
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                );
                                                            formik.setFieldValue(
                                                                "price",
                                                                value
                                                            );
                                                        }}
                                                    />
                                                </div>
                                                <div className="grid w-full items-center gap-1.5">
                                                    <Label>selle price</Label>
                                                    <Input
                                                        key="selleprice"
                                                        type="number"
                                                        value={
                                                            formik.values
                                                                .salePrice
                                                        }
                                                        onChange={(e) => {
                                                            const value =
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                );
                                                            formik.setFieldValue(
                                                                "salePrice",
                                                                value
                                                            );
                                                        }}
                                                    />
                                                </div>
                                                {/* free home delivery checkbox */}
                                                <div className="flex items-center gap-1">
                                                    <Checkbox
                                                        onCheckedChange={(
                                                            checked
                                                        ) => {
                                                            formik.setFieldValue(
                                                                "isHomeDeliveryFree",
                                                                checked
                                                            );
                                                        }}
                                                        checked={
                                                            formik.values
                                                                .isHomeDeliveryFree
                                                        }
                                                    />
                                                    <Label>
                                                        Free Home Delivery
                                                    </Label>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    {/* Product Status */}
                                    <Card x-chunk="dashboard-07-chunk-3">
                                        <CardHeader>
                                            <CardTitle>
                                                Product Status
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid gap-6">
                                                <div className="grid gap-3">
                                                    <Label htmlFor="status">
                                                        Status
                                                    </Label>
                                                    <Select
                                                        value={
                                                            formik.values.status
                                                        }
                                                        onValueChange={(
                                                            value
                                                        ) => {
                                                            formik.setFieldValue(
                                                                "status",
                                                                value
                                                            );
                                                        }}
                                                    >
                                                        <SelectTrigger
                                                            id="status"
                                                            aria-label="Select status"
                                                        >
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="upcoming">
                                                                Upcoming
                                                            </SelectItem>
                                                            <SelectItem value="inStock">
                                                                In Stock
                                                            </SelectItem>
                                                            <SelectItem value="outOfStock">
                                                                Out of Stock
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Product images */}
                                    <FileUpload
                                        value={formik.values.images}
                                        onChange={(files) => {
                                            formik.setFieldValue(
                                                "images",
                                                files
                                            );
                                        }}
                                        title="Product Images"
                                        description="Upload product images for the product"
                                        allowedFileTypes={[
                                            ".png",
                                            ".jpg",
                                            ".jpeg",
                                            ".webp",
                                        ]}
                                        type="multiple"
                                    />
                                </>
                            ) : (
                                <>
                                    <Variants
                                        formik={formik}
                                        attributes={attributes}
                                    />
                                </>
                            )}
                        </>
                    </div>
                </div>
                {/* Product Description and FAQ */}
                <div className="w-full space-y-4">
                    <div className="grid gap-3">
                        <ProductDescription
                            title="Description"
                            formik={formik}
                            name={"description"}
                        />
                    </div>

                    <div className="grid gap-3">
                        <CardTitle>FAQ</CardTitle>
                        <ProductFAQ formik={formik} />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center gap-2 md:hidden">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        history.back();
                    }}
                >
                    Discard
                </Button>
                <Button
                    size="sm"
                    onClick={() => {
                        formik.handleSubmit();
                    }}
                >
                    Save Product
                </Button>
            </div>
        </div>
    );
}

function ProductFAQ({ formik }) {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [editIndex, setEditIndex] = useState(null);

    const handleAdd = () => {
        if (question && answer) {
            const newFaq = {
                question,
                answer,
            };

            if (editIndex !== null) {
                // Update existing FAQ
                const updatedFaq = [...formik.values.faq];
                updatedFaq[editIndex] = newFaq;
                formik.setFieldValue("faq", updatedFaq);
                setEditIndex(null);
            } else {
                // Add new FAQ
                formik.setFieldValue("faq", [...formik.values.faq, newFaq]);
            }

            setQuestion("");
            setAnswer("");
        }
    };

    const handleEdit = (index) => {
        const faq = formik.values.faq[index];
        setQuestion(faq.question);
        setAnswer(faq.answer);
        setEditIndex(index);
    };

    const handleRemove = (index) => {
        const updatedFaq = formik.values.faq.filter((_, i) => i !== index);
        formik.setFieldValue("faq", updatedFaq);
    };

    const handleCancel = () => {
        setQuestion("");
        setAnswer("");
        setEditIndex(null);
    };

    return (
        <div className="space-y-4">
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label>Question</Label>
                    <Input
                        placeholder="Enter FAQ question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />
                </div>
                <div className="grid gap-2">
                    <Label>Answer</Label>
                    <Textarea
                        placeholder="Enter FAQ answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="h-fit"
                    />
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleAdd} type="button" className="w-fit">
                        {editIndex !== null ? "Update FAQ" : "Add FAQ"}
                    </Button>
                    {editIndex !== null && (
                        <Button
                            onClick={handleCancel}
                            type="button"
                            variant="outline"
                        >
                            Cancel
                        </Button>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                {formik.values.faq.map((faq, index) => (
                    <div
                        key={index}
                        className="flex items-start justify-between gap-4 rounded-lg border p-4"
                    >
                        <div className="space-y-1">
                            <p className="font-medium">Q: {faq.question}</p>
                            <p className="text-sm text-gray-500">
                                A: {faq.answer}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => handleEdit(index)}
                                variant="outline"
                                size="sm"
                            >
                                Edit
                            </Button>
                            <Button
                                onClick={() => handleRemove(index)}
                                variant="destructive"
                                size="sm"
                            >
                                Remove
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
