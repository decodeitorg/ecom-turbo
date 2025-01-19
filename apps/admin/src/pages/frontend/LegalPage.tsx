import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { $siteSettingData, postSiteSettingData } from "@/store/frontend";
import { toast } from "react-toastify";
import { useStore } from "@nanostores/react";
import Breadcamb from "@/layout/Breadcamb";

export default function LegalPage() {
  const legalSettingsData = useStore($siteSettingData);

  const formik = useFormik({
    initialValues: {
      aboutUs: "",
      customerService: "",
      privacyPolicy: "",
      termsAndConditions: "",
    },
    onSubmit: async (values) => {
      let res = await postSiteSettingData({
        type: "legalSettings",
        data: values,
      });
      if (res) {
        toast.success("Hero Carousel Updated Successfully");
      } else {
        toast.error("Failed to update Hero Carousel");
      }
    },
  });

  useEffect(() => {
    if (legalSettingsData) {
      formik.setValues({
        aboutUs: legalSettingsData.aboutUs,
        customerService: legalSettingsData.customerService,
        privacyPolicy: legalSettingsData.privacyPolicy,
        termsAndConditions: legalSettingsData.termsAndConditions,
      });
    }
  }, [legalSettingsData]);

  return (
    <>
      <Breadcamb items={[{ label: "Site Setting" }]} />

      <Tabs defaultValue="about_us">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="about_us">About Us</TabsTrigger>
          <TabsTrigger value="customer_service">Customer Service</TabsTrigger>
          <TabsTrigger value="privacy_policy">Privacy Policy</TabsTrigger>
          <TabsTrigger value="terms_and_conditions">
            Terms and Conditions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="about_us">
          <Card>
            <CardHeader>
              <CardTitle>About Us</CardTitle>
              <CardDescription>
                Write about your company and what you do.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-fit">
              <ReactQuill
                theme="snow"
                value={formik.values.aboutUs}
                onChange={(e) => formik.setFieldValue("aboutUs", e)}
              />
            </CardContent>
            <CardFooter>
              <Button onClick={() => formik.handleSubmit()}>Save</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="customer_service">
          <Card>
            <CardHeader>
              <CardTitle>Customer Service</CardTitle>
              <CardDescription>
                Write about your customer service.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-fit">
              <ReactQuill
                theme="snow"
                value={formik.values.customerService}
                onChange={(e) => formik.setFieldValue("customerService", e)}
              />
            </CardContent>
            <CardFooter>
              <Button onClick={() => formik.handleSubmit()}>Save</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="privacy_policy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Policy</CardTitle>
              <CardDescription>
                Write about your privacy policy.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-fit">
              <ReactQuill
                theme="snow"
                value={formik.values.privacyPolicy}
                onChange={(e) => formik.setFieldValue("privacyPolicy", e)}
              />
            </CardContent>
            <CardFooter>
              <Button onClick={() => formik.handleSubmit()}>Save</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="terms_and_conditions">
          <Card>
            <CardHeader>
              <CardTitle>Terms and Conditions</CardTitle>
              <CardDescription>
                Write about your terms and conditions.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-fit">
              <ReactQuill
                theme="snow"
                value={formik.values.termsAndConditions}
                onChange={(e) => formik.setFieldValue("termsAndConditions", e)}
              />
            </CardContent>
            <CardFooter>
              <Button onClick={() => formik.handleSubmit()}>Save</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
