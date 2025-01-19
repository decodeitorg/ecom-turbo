import Table from "@/components/common/Table";
import FileUpload from "@/components/common/Upload";
import { deleteData, postData, putData, useFetchData } from "@/hooks/hook";
import PageTitle from "@/components/Typography/PageTitle.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";

import { useFormik } from "formik";
import React, { useState } from "react";
import { object, string } from "yup";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useStore } from "@nanostores/react";
import {
  $siteSettingData,
  deleteSiteSettingData,
  postSiteSettingData,
  putSiteSettingData,
  refetchsiteSettingData,
} from "@/store/frontend";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-toastify";

export default function CustomerReviewImages() {
  const siteSettingData = useStore($siteSettingData);
  const customerReviewImages = siteSettingData?.customerReviewImages || [];

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = React.useState(false);

  const getCustomerReviewImages = () => {
    refetchsiteSettingData();
  };

  const deleteCustomerReviewImages = async (id) => {
    deleteSiteSettingData({
      type: "customerReviewImages",
      _id: id,
    });
  };
  const formik = useFormik({
    initialValues: {
      _id: "",
      alt: "",
      image: "",
      link: "",
    },
    validationSchema: object().shape({
      alt: string()
        .min(6, "Name must be at least 6 characters")
        .required("Alt is required"),
      image: string().required("Image is required"),
      link: string().required("Link is required"),
    }),

    onSubmit: async (values) => {
      if (isEdit) {
        //find in array and update
        let updateCustomerReviewImages = customerReviewImages.map((item) => {
          if (item._id === formik.values._id) {
            return values;
          }
          return item;
        });
        let res = await putSiteSettingData({
          type: "customerReviewImages",
          data: updateCustomerReviewImages,
        });
        if (res) {
          toast.success("Customer ReviewImages Updated Successfully");
        } else {
          toast.error("Failed to update Customer ReviewImages");
        }
        // setIsEdit(false);
      } else {
        delete values._id;
        let res = await postSiteSettingData({
          type: "customerReviewImages",
          data: values,
        });
        if (res) {
          toast.success("Customer ReviewImages Updated Successfully");
        } else {
          toast.error("Failed to update Customer ReviewImages");
        }
      }

      formik.resetForm();
      refetchsiteSettingData();
      setOpen(false);
    },
  });

  const handleModalClose = () => {
    formik.resetForm();
    setIsEdit(false);
    setOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <h1 className="text-2xl font-bold">Customer ReviewImages</h1>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <div className="flex items-center justify-between">
                  <Button>Add Image</Button>
                </div>
              </DialogTrigger>

              <DialogContent className="">
                <DialogHeader>
                  <DialogTitle>Add Picture to Carousel</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={formik.handleSubmit}
                  className="flex flex-col gap-4"
                >
                  <p className="col-span-4">
                    Please ensure the image is in a <strong>16:9</strong> aspect
                    ratio.
                  </p>

                  <Label htmlFor="image" className="text-right">
                    Image
                  </Label>
                  {/* <Input
                        id="image"
                        type="file"
                        className="col-span-3"
                        accept=".png,.jpg,.jpeg"
                        onChange={(e) =>
                          formik.setFieldValue("image", e.target.files[0])
                        }
                      /> */}
                  <FileUpload
                    allowedFileTypes={[".png", ".jpg", ".jpeg"]}
                    className="col-span-3 w-full"
                    type="single"
                    value={formik.values.image}
                    onChange={(value) => formik.setFieldValue("image", value)}
                  />

                  {formik.errors.image && formik.touched.image && (
                    <span className="col-span-3 col-start-2 text-red-500">
                      {formik.errors.image}
                    </span>
                  )}

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="alt" className="text-right">
                      Alt Text
                    </Label>
                    <Input
                      id="alt"
                      type="text"
                      className="col-span-3"
                      {...formik.getFieldProps("alt")}
                    />
                  </div>
                  {formik.errors.alt && formik.touched.alt && (
                    <span className="col-span-3 col-start-2 text-red-500">
                      {formik.errors.alt}
                    </span>
                  )}

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="link" className="text-right">
                      Link
                    </Label>
                    <Input
                      id="link"
                      type="text"
                      className="col-span-3"
                      {...formik.getFieldProps("link")}
                    />
                  </div>
                  {formik.errors.link && formik.touched.link && (
                    <span className="col-span-3 col-start-2 text-red-500">
                      {formik.errors.link}
                    </span>
                  )}

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleModalClose}
                    >
                      Close
                    </Button>
                    <Button type="submit">{isEdit ? "Edit" : "Add"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardTitle>

          <CardDescription>
            <p>The Customer ReviewImages are displayed in the frontend.</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table
            bordered
            data={customerReviewImages?.length > 0 ? customerReviewImages : []}
            columns={[
              {
                name: "Image",
                uid: "image",
                formatter: (row) => {
                  return (
                    <img
                      className="aspect-video rounded-lg object-contain"
                      key={row._id}
                      src={row}
                      alt={row.name}
                      width={(340 / 9) * 16}
                    />
                  );
                },
              },
              {
                name: "Alt",
                uid: "alt",
              },
              {
                name: "Link",
                uid: "link",
              },
            ]}
            onReload={getCustomerReviewImages}
            onEdit={(row) => {
              setIsEdit(true);
              formik.setValues(row);
              setOpen(true);
            }}
            onDelete={async (row) => {
              await deleteCustomerReviewImages(row._id);
            }}
          />
        </CardContent>
      </Card>
    </>
  );
}
