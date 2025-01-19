import Table from "@/components/common/Table";
import UpdateProduct from "@/components/products/forTable/UpdateProduct.tsx";
import UpdateProductVariant from "@/components/products/forTable/UpdateProductVariant.tsx";
import UpdateStatus from "@/components/products/forTable/UpdateStatus.tsx";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { deleteData, putData, useFetchData } from "@/hooks/hook";
import { generateVariantQueryStringAndName } from "@/lib/product.ts";
import { Link, useNavigate } from "react-router-dom";
import Breadcamb from "@/layout/Breadcamb";
import ProductExcelExportButton from "@/components/common/ProductExportToExcel";

export default function Products() {
    let [allProducts, getAllProducts, setAllProducts, loading, error] =
        useFetchData("/api/admin/products", { limit: 51 });

    const navigate = useNavigate();

    return (
        <div className="">
            <Breadcamb
                items={[
                    { label: "Products Management" },
                    { label: "Products List" },
                ]}
            />
            <div className="grid grid-cols-2 gap-3">
                <CardTitle>Product List</CardTitle>

                <div className="flex justify-end">
                    <ProductExcelExportButton data={allProducts?.docs || []} />
                    {/* <Filter getAllProducts={getAllProducts} /> */}
                    <Link to="/admin/products/add-product">
                        <Button color="primary">Add Product</Button>
                    </Link>
                </div>
            </div>

            <Table
                bordered
                data={allProducts}
                columns={[
                    {
                        name: "Logo",
                        uid: "logo",
                        formatter: (col, row) => {
                            return (
                                <div className="flex min-w-96 items-center justify-start">
                                    <div className="m-2">
                                        <a
                                            href={`/product/${row.slug}`}
                                            target="_blank"
                                        >
                                            <img
                                                src={
                                                    row?.hasVariants
                                                        ? row?.variants[0]
                                                              ?.images[0]
                                                        : row?.images[0]
                                                }
                                                alt={row?.name}
                                                width={150}
                                                height={150}
                                                className="h-24 w-24 rounded-md object-contain"
                                            />
                                        </a>
                                    </div>

                                    <div>
                                        <a
                                            href={`/product/${row.slug}`}
                                            target="_blank"
                                            className="hover:underline"
                                        >
                                            <p className="text-wrap text-lg font-semibold text-slate-600">
                                                {" "}
                                                {row?.name}
                                            </p>
                                        </a>
                                        <p className="mt-1 text-wrap text-xs text-slate-400">
                                            {row?.category?.name}
                                        </p>
                                        <p className="mt-2 flex gap-3 text-xs text-slate-400">
                                            <span className="w-24">
                                                Last Updated :{" "}
                                            </span>
                                            {new Date(
                                                row?.updatedAt
                                            ).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "2-digit",
                                            })}
                                        </p>
                                        <p className="mt-1 flex gap-3 text-xs text-slate-400">
                                            <span className="w-24">
                                                Added At :{" "}
                                            </span>{" "}
                                            {new Date(
                                                row?.createdAt
                                            ).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            );
                        },
                    },
                    {
                        name: (
                            <tr className="text-center">
                                <th className="w-36">Variant</th>
                                <th className="w-16">SalePrice</th>
                                <th className="w-16">Price</th>
                                <th className="w-28">Status</th>
                            </tr>
                        ),
                        uid: "hasVariants",
                        formatter: (cell, row) => {
                            if (!cell) {
                                return (
                                    <tr className="text-center">
                                        <td className="w-36">-</td>
                                        <td className="w-16">
                                            <UpdateProduct
                                                className="w-16"
                                                needToUpdate={"salePrice"}
                                                key={row._id}
                                                cell={row?.salePrice}
                                                productID={row._id}
                                            />
                                        </td>
                                        <td className="w-16">
                                            <UpdateProduct
                                                className="w-16"
                                                needToUpdate={"price"}
                                                key={row._id}
                                                cell={row?.price}
                                                productID={row._id}
                                            />
                                        </td>
                                        <td className="w-28">
                                            <UpdateStatus
                                                className="w-28"
                                                cell={row?.status}
                                                key={row._id}
                                                productID={row._id}
                                            />
                                        </td>
                                    </tr>
                                );
                            } else {
                                return (
                                    <table className="table-auto">
                                        <tbody>
                                            {row?.variants.map(
                                                (variant, index) => {
                                                    let {
                                                        url = "",
                                                        nameOfVariant = "",
                                                    } =
                                                        generateVariantQueryStringAndName(
                                                            variant,
                                                            row?.variantsAttributes
                                                        );
                                                    return (
                                                        <tr
                                                            key={index}
                                                            className="text- center flex text-center"
                                                        >
                                                            <td className="w-36 border border-slate-100 pr-3 text-end">
                                                                {nameOfVariant}
                                                            </td>
                                                            <td className="w-16 border border-slate-100">
                                                                <UpdateProductVariant
                                                                    className={
                                                                        "w-16 py-1"
                                                                    }
                                                                    needToUpdate={
                                                                        "salePrice"
                                                                    }
                                                                    variantId={
                                                                        variant.id
                                                                    }
                                                                    key={index}
                                                                    cell={
                                                                        variant.salePrice
                                                                    }
                                                                    productID={
                                                                        row._id
                                                                    }
                                                                />
                                                            </td>
                                                            <td className="w-16 border border-slate-100">
                                                                <UpdateProductVariant
                                                                    className={
                                                                        "w-16 py-1"
                                                                    }
                                                                    needToUpdate={
                                                                        "price"
                                                                    }
                                                                    variantId={
                                                                        variant.id
                                                                    }
                                                                    key={index}
                                                                    cell={
                                                                        variant.price
                                                                    }
                                                                    productID={
                                                                        row._id
                                                                    }
                                                                />
                                                            </td>
                                                            <td className="w-28 border border-slate-100">
                                                                <UpdateStatus
                                                                    className="w-28 py-1"
                                                                    cell={
                                                                        variant.status
                                                                    }
                                                                    key={index}
                                                                    productID={
                                                                        row._id
                                                                    }
                                                                    variantId={
                                                                        variant.id
                                                                    }
                                                                />
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )}
                                        </tbody>
                                    </table>
                                );
                            }
                        },
                    },
                    {
                        name: "Is Published",
                        uid: "isPublished",
                        formatter: (col, row) => {
                            return (
                                <div className="flex items-center justify-center">
                                    <Switch
                                        checked={col}
                                        onCheckedChange={(
                                            isSelected: boolean
                                        ) => {
                                            putData(
                                                "/api/admin/products/product",
                                                {
                                                    _id: row._id,
                                                    isPublished: isSelected,
                                                }
                                            );
                                            let newProducts =
                                                allProducts?.docs?.map(
                                                    (product) => {
                                                        if (
                                                            product._id ===
                                                            row._id
                                                        ) {
                                                            product.isPublished =
                                                                isSelected;
                                                        }
                                                        return product;
                                                    }
                                                );
                                            setAllProducts({
                                                ...allProducts,
                                                docs: newProducts,
                                            });
                                        }}
                                    />
                                </div>
                            );
                        },
                    },
                ]}
                onReload={getAllProducts}
                loading={loading}
                onEdit={(row) => {
                    navigate(`/admin/products/edit-product/${row._id}`);
                }}
                onDelete={async (row) => {
                    if (
                        window.confirm(
                            "Are you sure you want to delete this user?"
                        )
                    ) {
                        let res = await deleteData(
                            "/api/admin/products/product",
                            {
                                _id: row._id,
                            }
                        );
                        getAllProducts();
                    }
                }}
            />
        </div>
    );
}
