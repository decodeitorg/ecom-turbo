import FileUpload from "@/components/common/Upload";

import { useFormik } from "formik";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  $siteSettingData,
  $siteSettingDataLoading,
  $siteSettingDataError,
  postSiteSettingData,
} from "@/store/frontend";
import { useStore } from "@nanostores/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-toastify";
import { TypographyH2 } from "@/components/ui/typography";
import Breadcamb from "@/layout/Breadcamb";

export default function SiteSettings() {
  const siteSettingData = useStore($siteSettingData);
  const siteSettingDataError = useStore($siteSettingDataError);

  if (siteSettingDataError) toast.error(siteSettingDataError);

  const formik = useFormik({
    initialValues: {
      logo: "",
      name: "",
      description: "",
      youtube: "",
      instagram: "",
      facebook: "",
      tiktok: "",
      email: "",
      phoneNumber: [],
      whatsappNumber: "",
      address: [],
    },
    onSubmit: async (values) => {
      let res = await postSiteSettingData({
        type: "siteSettings",
        data: values,
      });

      if (res) {
        toast.success("Site settings updated successfully");
      } else {
        toast.error("Failed to update site settings");
      }
    },
  });

  useEffect(() => {
    if (siteSettingData) {
      formik.setValues({
        logo: siteSettingData.logo || "",
        name: siteSettingData.name || "",
        description: siteSettingData.description || "",
        youtube: siteSettingData.youtube || "",
        instagram: siteSettingData.instagram || "",
        facebook: siteSettingData.facebook || "",
        tiktok: siteSettingData.tiktok || "",
        email: siteSettingData.email || "",
        phoneNumber: siteSettingData.phoneNumber || [],
        whatsappNumber: siteSettingData.whatsappNumber || "",
        address: siteSettingData.address || [],
      });
    }
  }, [siteSettingData]);

  return (
    <>
      <Breadcamb items={[{ label: "Site Setting" }]} />
      <TypographyH2>Frontend Site Settings</TypographyH2>
      <div className="mt-3 space-y-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="col-span-12 md:col-span-6">
            {/* logo  */}
            <Card>
              <CardHeader>
                <CardTitle>Logo</CardTitle>
                <CardDescription>Your store logo.</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-3">
                <FileUpload
                  value={formik.values.logo}
                  onChange={(v) => formik.setFieldValue("logo", v)}
                  allowedFileTypes={[".jpg", ".jpeg", ".png", ".webp"]}
                  type="single"
                  title="Upload Logo"
                />
                <Button onClick={formik.handleSubmit}>Save</Button>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-12 md:col-span-6">
            {/* name  */}
            <Card>
              <CardHeader>
                <CardTitle>Short Description</CardTitle>
                <CardDescription>
                  A short description of your store.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Textarea
                  placeholder="Store Description"
                  value={formik.values.description}
                  onChange={(e) =>
                    formik.setFieldValue("description", e.target.value)
                  }
                />
                <Button onClick={formik.handleSubmit}>Save</Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="col-span-6">
            {/* description  */}
            <Card>
              <CardHeader>
                <CardTitle>Store Name</CardTitle>
                <CardDescription>
                  Used to identify your store in the marketplace.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Input
                  placeholder="Store Name"
                  value={formik.values.name}
                  onChange={(e) => formik.setFieldValue("name", e.target.value)}
                />
                <Button onClick={formik.handleSubmit}>Save</Button>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-6">
            <Card>
              <CardHeader>
                <CardTitle>Email</CardTitle>
                <CardDescription>
                  Your email address will be used for store communication.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Input
                  placeholder="Email Address"
                  value={formik.values.email}
                  onChange={(e) =>
                    formik.setFieldValue("email", e.target.value)
                  }
                />
                <Button onClick={formik.handleSubmit}>Save</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
            <CardDescription>
              Add popular social media links to your store.
            </CardDescription>
          </CardHeader>

          <CardContent className="lg:md-cols-4 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              placeholder="YouTube URL"
              value={formik.values.youtube}
              onChange={(e) => formik.setFieldValue("youtube", e.target.value)}
            />

            <Input
              placeholder="Instagram URL"
              value={formik.values.instagram}
              onChange={(e) =>
                formik.setFieldValue("instagram", e.target.value)
              }
            />

            <Input
              placeholder="Facebook URL"
              value={formik.values.facebook}
              onChange={(e) => formik.setFieldValue("facebook", e.target.value)}
            />

            <Input
              placeholder="TikTok URL"
              value={formik.values.tiktok}
              onChange={(e) => formik.setFieldValue("tiktok", e.target.value)}
            />
          </CardContent>
          <CardFooter>
            <Button onClick={formik.handleSubmit}>Save</Button>
          </CardFooter>
        </Card>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex justify-between">
                <div>Whatsapp Number</div>
              </CardTitle>
              <CardDescription>
                Add Whatsapp number. must start with +880
              </CardDescription>
            </CardHeader>

            <CardContent className="lg:md-cols-4 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <Input
                    placeholder="+8801xxxxxxxx"
                    value={formik.values.whatsappNumber}
                    onChange={(e) => {
                      formik.setFieldValue("whatsappNumber", e.target.value);
                    }}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={formik.handleSubmit}>Save</Button>
            </CardFooter>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex justify-between">
                <div>Phone</div>
                <Button
                  onClick={() => {
                    formik.setFieldValue("phoneNumber", [
                      ...formik.values.phoneNumber,
                      "",
                    ]);
                  }}
                >
                  Add Phone
                </Button>
              </CardTitle>
              <CardDescription>
                Add phone numbers for store communication
              </CardDescription>
            </CardHeader>

            <CardContent className="lg:md-cols-4 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                {formik.values?.phoneNumber?.map((phone, index) => (
                  <div key={index} className="grid grid-cols-1 gap-4">
                    <Input
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => {
                        let temp = formik.values.phoneNumber;
                        temp[index] = e.target.value;
                        formik.setFieldValue("phoneNumber", temp);
                      }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={formik.handleSubmit}>Save</Button>
            </CardFooter>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex justify-between">
                <div>Address</div>
                <Button
                  onClick={() => {
                    formik.setFieldValue("address", [
                      ...formik.values.address,
                      "",
                    ]);
                  }}
                >
                  Add Address
                </Button>
              </CardTitle>
              <CardDescription>
                Add address for store communication
              </CardDescription>
            </CardHeader>

            <CardContent className="lg:md-cols-4 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                {formik.values?.address?.map((add, index) => (
                  <div key={index} className="grid grid-cols-1 gap-4">
                    <Textarea
                      placeholder={` Address ${index + 1}`}
                      value={add}
                      onChange={(e) => {
                        let temp = formik.values.address;
                        temp[index] = e.target.value;
                        formik.setFieldValue("address", temp);
                      }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={formik.handleSubmit}>Save</Button>
            </CardFooter>
          </Card>
        </div>
        <br />
        <br />
        <br />
        <br />
      </div>
    </>
  );
}
