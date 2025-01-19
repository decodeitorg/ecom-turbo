import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useStore } from "@nanostores/react";
import {
  $siteSettingData,
  postSiteSettingData,
  putSiteSettingData,
  refetchsiteSettingData,
} from "@/store/frontend";
import { toast } from "react-toastify";
import FileUpload from "@/components/common/Upload";

export default function WhyChooseUs() {
  const siteSettingData = useStore($siteSettingData);
  const whyChooseUs = siteSettingData?.whyChooseUs || {};

  //   const validationSchema = Yup.object().shape({
  //     title: Yup.string(), //.required('Title is required'),
  //     points: Yup.array().of(
  //       Yup.object().shape({
  //         title: Yup.string(), //.required('Point title is required'),
  //         description: Yup.string(), //.required('Point description is required'),
  //       }),
  //     ), //.min(2, 'At least two points are required'),
  //     image: Yup.string(), //.required('Image is required'),
  //     image2: Yup.string(), //.required('Image 2 is required'),
  //     button: Yup.object().shape({
  //       text: Yup.string(), //.required('Button text is required'),
  //       link: Yup.string(), //.required('Button link is required'),
  //     }),
  //   });

  const formik = useFormik({
    initialValues: {
      title: whyChooseUs?.title || "",
      points: whyChooseUs?.points || [
        { title: "", description: "" },
        { title: "", description: "" },
      ],
      image: whyChooseUs?.image || "",
      image2: whyChooseUs?.image2 || "",
      button: whyChooseUs?.button || { text: "", link: "" },
    },
    // validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      const res = await (whyChooseUs._id
        ? putSiteSettingData({ type: "whyChooseUs", data: values })
        : postSiteSettingData({ type: "whyChooseUs", data: values }));

      if (res) {
        toast.success("Why Choose Us updated successfully");
        refetchsiteSettingData();
      } else {
        toast.error("Failed to update Why Choose Us");
      }
    },
  });

  const getErrorMessage = (fieldName: string) => {
    return formik.touched[fieldName] && formik.errors[fieldName]
      ? String(formik.errors[fieldName])
      : null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Why Choose Us</CardTitle>
        <CardDescription>
          Highlight the reasons why customers should choose your business.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formik.values.title}
              onChange={(e) => formik.setFieldValue("title", e.target.value)}
            />
            {getErrorMessage("title") && (
              <div className="text-red-500">{getErrorMessage("title")}</div>
            )}
          </div>

          {formik.values.points.map((_, index) => (
            <div key={index} className="space-y-4">
              <div>
                <Label htmlFor={`points.${index}.title`}>
                  Point {index + 1} Title
                </Label>
                <Input
                  id={`points.${index}.title`}
                  value={formik.values.points[index].title}
                  onChange={(e) =>
                    formik.setFieldValue(
                      `points.${index}.title`,
                      e.target.value
                    )
                  }
                />
                {formik.touched.points?.[index]?.title &&
                  formik.errors.points?.[index]?.title && (
                    <div className="text-red-500">
                      {String(formik.errors.points[index].title)}
                    </div>
                  )}
              </div>
              <div>
                <Label htmlFor={`points.${index}.description`}>
                  Point {index + 1} Description
                </Label>
                <Textarea
                  id={`points.${index}.description`}
                  value={formik.values.points[index].description}
                  onChange={(e) =>
                    formik.setFieldValue(
                      `points.${index}.description`,
                      e.target.value
                    )
                  }
                />
                {formik.touched.points?.[index]?.description &&
                  formik.errors.points?.[index]?.description && (
                    <div className="text-red-500">
                      {String(formik.errors.points[index].description)}
                    </div>
                  )}
              </div>
            </div>
          ))}

          <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
            <div className="w-full md:w-1/2">
              <Label htmlFor="image">Image</Label>
              <FileUpload
                allowedFileTypes={[".png", ".jpg", ".jpeg"]}
                className="w-full"
                type="single"
                value={formik.values.image}
                onChange={(value) => formik.setFieldValue("image", value)}
              />
              {getErrorMessage("image") && (
                <div className="text-red-500">{getErrorMessage("image")}</div>
              )}
            </div>

            <div className="w-full md:w-1/2">
              <Label htmlFor="image2">Image 2</Label>
              <FileUpload
                allowedFileTypes={[".png", ".jpg", ".jpeg"]}
                className="w-full"
                type="single"
                value={formik.values.image2}
                onChange={(value) => formik.setFieldValue("image2", value)}
              />
              {getErrorMessage("image2") && (
                <div className="text-red-500">{getErrorMessage("image2")}</div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="button.text">Button Text</Label>
            <Input
              id="button.text"
              value={formik.values.button.text}
              onChange={(e) =>
                formik.setFieldValue("button.text", e.target.value)
              }
            />
            {formik.touched.button?.text && formik.errors.button?.text && (
              <div className="text-red-500">
                {String(formik.errors.button.text)}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="button.link">Button Link</Label>
            <Input
              id="button.link"
              value={formik.values.button.link}
              onChange={(e) =>
                formik.setFieldValue("button.link", e.target.value)
              }
            />
            {formik.touched.button?.link && formik.errors.button?.link && (
              <div className="text-red-500">
                {String(formik.errors.button.link)}
              </div>
            )}
          </div>

          <Button type="submit" onClick={() => formik.handleSubmit()}>
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
