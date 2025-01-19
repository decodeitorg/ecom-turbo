import Table from "@/components/common/Table";
import FileUpload from "@/components/common/Upload";

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

export default function HeroCarousel() {
  const siteSettingData = useStore($siteSettingData);
  const heroCarousel = siteSettingData?.heroCarousel || [];

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = React.useState(false);

  const getHeroCarousel = () => {
    refetchsiteSettingData();
  };

  const deleteHeroCarousel = async (id) => {
    const res = deleteSiteSettingData({
      type: "heroCarousel",
      _id: id,
    });
    if (res) {
      toast.success("Hero Carousel Updated Successfully");
    } else {
      toast.error("Failed to update Hero Carousel");
    }
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
        try {
          //find in array and update
          let updateHeroCarousel = heroCarousel.map((item) => {
            if (item._id === formik.values._id) {
              return values;
            }
            return item;
          });

          await putSiteSettingData({
            type: "heroCarousel",
            data: updateHeroCarousel,
          });

          toast.success("Hero Carousel Updated Successfully");
        } catch (error) {
          toast.error(error.message);
        }
        // setIsEdit(false);
      } else {
        delete values._id;
        try {
          let res = await postSiteSettingData({
            type: "heroCarousel",
            data: values,
          });

          toast.success("Hero Carousel Updated Successfully");
        } catch (error) {
          toast.error(error.message);
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
      <div>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <h1 className="text-2xl font-bold">Hero Carousel</h1>
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
            <p>
              The Hero Carousel is the first thing customers see when they visit
              your store. Make sure it's engaging and relevant to your brand.
            </p>
          </CardDescription>
        </CardHeader>
        <div>
          <Table
            bordered
            data={heroCarousel?.length > 0 ? heroCarousel : []}
            columns={[
              {
                name: "Image",
                uid: "image",
                formatter: (row) => {
                  return (
                    <img
                      className="obj-contain aspect-video rounded-lg"
                      key={row._id}
                      src={row}
                      alt={row.name}
                      height={340}
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
            onReload={getHeroCarousel}
            onEdit={(row) => {
              setIsEdit(true);
              formik.setValues(row);
              setOpen(true);
            }}
            onDelete={async (row) => {
              await deleteHeroCarousel(row._id);
            }}
          />
        </div>
      </div>
    </>
  );
}
