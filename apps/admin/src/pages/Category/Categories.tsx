import Table from "@/components/common/Table";
import FileUpload from "@/components/common/Upload";

import { useLState } from "@/hooks/hook";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { AiOutlineProject } from "react-icons/ai";
import { FiChevronRight } from "react-icons/fi";
import { IoRemoveSharp } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@nanostores/react";
import {
  $categories,
  $categoriesLoading,
  deleteCategories,
  postCategories,
  putCategories,
  refetchCategories,
} from "@/store/categories";
import { toast } from "react-toastify";
import Breadcamb from "@/layout/Breadcamb";
import Editor from "@/components/common/Editor";

export default function ChildCategories() {
  const { _id } = useParams();

  let allCategory = useStore($categories);
  let categoriesLoading = useStore($categoriesLoading);

  const [childCategory, setChildCategory] = useState([]);
  const [selectedObj, setSelectObj] = useState([]);
  const [showChild, setShowChild] = useLState("showChild", false);
  const [isEdit, setIsEdit] = useState(false);
  const [levelDepth, setLevelDepth] = useState(0);

  const [open, setOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      _id: "",
      name: "",
      description: "",
      icon: "",
      youtubeLink: "",
      parentId: _id ?? null,
    },
    onSubmit: async (values) => {
      if (isEdit) {
        let res = await putCategories({
          ...values,
          _id: values._id,
        });
        console.log("🚀 ~ onSubmit: ~ res:", res);
        if (res) {
          toast.success("Category updated successfully");
        } else {
          toast.error("Category update failed");
        }
      } else {
        delete values._id;
        try {
          await postCategories({
            ...values,
            parentId: _id ?? null,
          });
          toast.success("Category added successfully");
        } catch (error) {
          toast.error(error.message);
        }
      }
      refetchCategories();
      // formik.resetForm();
    },
  });

  console.log("🚀 ~ formik.values:", formik.values);
  useEffect(() => {
    if (!!_id) {
      const getAncestors = (target, children, ancestors = [], depth = 1) => {
        let maxDepth = depth; // Local variable to keep track of the maximum depth for the current id

        for (let child of children) {
          if (child._id === target) {
            return { ancestors: [...ancestors, child], maxDepth };
          }
          if (child.children.length > 0) {
            const result = getAncestors(
              target,
              child.children,
              [...ancestors, child],
              depth + 1
            );
            if (result) {
              maxDepth = Math.max(maxDepth, result.maxDepth); // Update the local variable with the maximum depth
              return { ancestors: result.ancestors, maxDepth };
            }
          }
        }
      };

      function getChildren(array, id) {
        let children = [];
        array.forEach((item) => {
          if (item._id === id) {
            children = [...children, ...item.children];
          }
          if (item.children.length > 0) {
            children = [...children, ...getChildren(item.children, id)];
          }
        });
        return children;
      }

      if (!categoriesLoading) {
        const result = getChildren(allCategory, _id);
        const res = getAncestors(_id, allCategory);

        setChildCategory(result);
        setSelectObj(res.ancestors);
        setLevelDepth(res.maxDepth);
      }
    } else {
      setChildCategory(allCategory);
      setSelectObj([]);
      setLevelDepth(0);
    }
  }, [_id, categoriesLoading, allCategory]);

  return (
    <section>
      {/* <ol className="flex w-full items-center overflow-hidden font-serif">
          <li className="cursor-pointer pr-1 font-semibold transition duration-200 ease-in">
            <Link to={`/admin/products/categories`}>Categories</Link>
          </li>
          {selectedObj?.map((child, i) => (
            <span key={i + 1} className="flex items-center font-serif">
              <li className="mt-[1px]">
                {' '}
                <FiChevronRight />{' '}
              </li>
              <li className="cursor-pointer pl-1 font-semibold text-blue-700 transition duration-200 ease-in hover:text-blue-500">
                <Link to={`/admin/products/categories/${child._id}`}>
                  {child?.name}
                </Link>
              </li>
            </span>
          ))}
        </ol> */}
      <Breadcamb
        items={[
          { label: "Categories", path: "/admin/products/Categories" },
          ...selectedObj.map((item) => ({
            label: item.name,
            path: `/admin/products/categories/${item._id}`,
          })),
        ]}
      />

      <div className="my-4 flex items-center justify-end gap-3">
        {levelDepth < 2 && (
          <>
            <span className="w-20 text-sm">Show child</span>
            <Switch
              color="success"
              checked={showChild}
              onCheckedChange={(isSelected) => setShowChild(isSelected)}
            />
          </>
        )}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              onClick={() => {
                setIsEdit(false);
                setOpen(true);
              }}
            >
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95%] rounded-md p-3">
            <DialogHeader>
              <DialogTitle>
                {isEdit ? "Edit Category" : "Add Category"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={formik.handleSubmit}>
              <div className="my-3 flex flex-col gap-3">
                <div className="w-full">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    className="col-span-3"
                    value={formik.values.name}
                    onChange={(e) =>
                      formik.setFieldValue("name", e.target.value)
                    }
                  />
                </div>
                <div className="w-full">
                  <Label htmlFor="icon" className="text-right">
                    Icon
                  </Label>
                  <FileUpload
                    value={formik.values.icon}
                    onChange={(value) => formik.setFieldValue("icon", value)}
                    type="single"
                    allowedFileTypes={["png", ".jpg", ".jpeg"]}
                  />
                </div>
                <div className="w-full">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Editor
                    value={formik.values.description}
                    onValueChange={(value) =>
                      formik.setFieldValue("description", value)
                    }
                  />
                </div>

                {/* youtube link  */}
                <div className="w-full">
                  <Label htmlFor="youtubeLink" className="text-right">
                    Youtube Link
                  </Label>
                  <Input
                    id="youtubeLink"
                    className="col-span-3"
                    value={formik.values.youtubeLink}
                    onChange={(e) =>
                      formik.setFieldValue("youtubeLink", e.target.value)
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
                <Button type="submit">
                  {isEdit ? "Update Category" : "Add Category"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <Table
          data={childCategory}
          columns={[
            {
              name: "ICON",
              uid: "icon",
              sortable: false,
              formatter: (cell: any) => {
                return <img src={cell} width={50} height={50} />;
              },
            },

            {
              name: "Name",
              uid: "name",
              sortable: true,
              formatter: (cell: any, row: any) => {
                return (
                  <>
                    {levelDepth < 2 ? (
                      <Link
                        to={`/admin/products/categories/${row?._id}`}
                        className="text-blue-700"
                        key={row?._id}
                      >
                        {cell}

                        <div
                          className={`transform transition-all duration-500 ease-in-out ${showChild ? "block" : "hidden"}`}
                        >
                          {row?.children?.length > 0 &&
                            row.children.map((child: any) => (
                              <div key={child._id}>
                                <Link
                                  to={`/admin/products/categories/${child?._id}`}
                                  className="text-blue-700"
                                >
                                  <div className="flex items-center text-xs text-blue-800">
                                    <span className="pr-1 text-xs text-gray-500">
                                      <IoRemoveSharp />
                                    </span>
                                    <span className="text-gray-500">
                                      {child?.name}
                                    </span>
                                  </div>
                                </Link>
                              </div>
                            ))}
                        </div>
                      </Link>
                    ) : (
                      <div key={row?._id}>{cell}</div>
                    )}
                  </>
                );
              },
            },
            // {
            //   name: "Specification",
            //   uid: "specification",
            //   formatter: (cell: any, row: any) => {
            //     return (
            //       <Link
            //         to={`/admin/products/categories/specification/${row._id}`}
            //       >
            //         <CiViewList className="h-8 w-8 hover:text-blue-500" />
            //       </Link>
            //     );
            //   },
            // },

            {
              name: "Status",
              uid: "status",
              sortable: true,
              formatter: (cell: any, row: any) => {
                return (
                  <Switch
                    checked={cell === "show" ? true : false}
                    color={cell === "show" ? "success" : "warning"}
                    aria-label="Switch status,if you want to change status, please click this button."
                    onCheckedChange={async (value) => {
                      let status = value ? "show" : "hide";
                      let res = await putCategories({
                        status: status,
                        _id: row._id,
                      });
                      if (res) {
                        toast.success("Category status updated successfully");
                      } else {
                        toast.error("Category status update failed");
                      }
                    }}
                  />
                );
              },
            },
          ]}
          onReload={refetchCategories}
          loading={false}
          onEdit={(row) => {
            setOpen(true);
            setIsEdit(true);
            formik.setValues({
              ...row,
              name: row.name,
              description: row.description,
              _id: row._id,
            });
          }}
          onDelete={async (row) => {
            if (window.confirm("Are you sure you want to delete this user?")) {
              try {
                await deleteCategories({
                  _id: row._id,
                });
                toast.success("Category deleted successfully");
              } catch (error) {
                toast.error(error.message);
              }
              refetchCategories();
            }
          }}
        />
      </div>
    </section>
  );
}
