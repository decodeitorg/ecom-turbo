import Table from "@/components/common/Table";
import FileUpload from "@/components/common/Upload";
import { postData, putData, useFetchData } from "@/hooks/hook";

import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useFormik } from "formik";
import React, { useState } from "react";
import { object, string } from "yup";
import { Label } from "@/components/ui/label";
import { useStore } from "@nanostores/react";

import {
  $siteSettingData,
  deleteSiteSettingData,
  postSiteSettingData,
  putSiteSettingData,
  refetchsiteSettingData,
} from "@/store/frontend";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function FeatureBanner() {
  const siteSettingData = useStore($siteSettingData);

  const featureBanner = siteSettingData?.featureBanner || {};

  const [open, setOpen] = useState(false);

  const [isEdit, setIsEdit] = React.useState(false);

  const formik = useFormik({
    initialValues: {
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
        const res = await postSiteSettingData({
          type: "featureBanner",
          data: values,
        });
        if (res) {
          toast.success("Customer ReviewImages Updated Successfully");
        } else {
          toast.error("Failed to update Customer ReviewImages");
        }
      } else {
        const res = await putSiteSettingData({
          type: "featureBanner",
          data: values,
        });
        if (res) {
          toast.success("Customer ReviewImages Updated Successfully");
        } else {
          toast.error("Failed to update Customer ReviewImages");
        }
      }
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
            <h1 className="text-2xl font-bold">Feature Banner</h1>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>Add Image</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Feature Banner</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={formik.handleSubmit}
                  className="flex w-full flex-col gap-4"
                >
                  <Label htmlFor="image" className="text-right">
                    Image (4:3)
                  </Label>

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
          <br />
          <p className="text-muted-foreground">
            Feature Banner (3:1 Aspect Ratio)
          </p>
          <a href={featureBanner?.link}>
            <div className="flex h-96 w-full items-start justify-items-start">
              <img
                className="aspect-[3/1] object-fill"
                height={1080 / 2}
                width={1920 / 2}
                src={featureBanner?.image}
                alt={featureBanner?.alt}
              />
            </div>
          </a>
        </CardContent>
      </Card>
    </>
  );
}
