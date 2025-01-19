import React, { useState } from "react";
import { useStore } from "@nanostores/react";
import { useFormik } from "formik";
import { object, string, ref } from "yup";
import { toast } from "react-toastify";
import { $userData, updateUserProfile } from "@/store/user";
import FileUpload from "@/components/common/Upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Breadcamb from "../layout/Breadcamb";

const ProfileForm = ({ userData }) => {
  const formik = useFormik({
    initialValues: {
      name: userData?.name || "",
      phone: userData?.phone?.number || "",
      image: userData?.image || "",
    },
    validationSchema: object().shape({
      name: string()
        .min(3, "Name must be at least 3 characters")
        .required("Name is required"),
      phone: string()
        .matches(/^(?:\+88|01)?(?:\d{11}|\d{13})$/, "Phone number is not valid")
        .required("Phone number is required"),
      image: string().required("Image is required"),
    }),
    onSubmit: async (values) => {
      try {
        await updateUserProfile({
          type: "profile",
          data: values,
        });
        toast.success("Profile updated successfully");
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          onChange={formik.handleChange}
          value={formik.values.name}
        />
        {formik.errors.name && formik.touched.name && (
          <p className="text-sm text-red-500">{formik.errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          onChange={formik.handleChange}
          value={formik.values.phone}
        />
        {formik.errors.phone && formik.touched.phone && (
          <p className="text-sm text-red-500">{formik.errors.phone}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Profile Image</Label>
        <FileUpload
          value={formik.values.image}
          onChange={(value) => formik.setFieldValue("image", value)}
          type="single"
          allowedFileTypes={[".png", ".jpg", ".jpeg"]}
          className="w-full"
          title="Profile Image"
        />
        {formik.errors.image && formik.touched.image && (
          <p className="text-sm text-red-500">{formik.errors.image}</p>
        )}
      </div>

      <Button type="submit" disabled={formik.isSubmitting}>
        Update Profile
      </Button>
    </form>
  );
};

const PasswordInput = ({ id, name, onChange, value, error, touched }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        onChange={onChange}
        value={value}
        className="pr-10"
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 flex items-center pr-3"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4 text-gray-400" />
        ) : (
          <Eye className="h-4 w-4 text-gray-400" />
        )}
      </button>
      {error && touched && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

const PasswordForm = () => {
  const formik = useFormik({
    initialValues: {
      currentPassword: "11111111",
      newPassword: "22222222",
      confirmPassword: "22222222",
    },
    validationSchema: object().shape({
      currentPassword: string().required("Current password is required"),
      newPassword: string()
        .min(8, "Password must be at least 8 characters")
        .required("New password is required"),
      confirmPassword: string()
        .oneOf([ref("newPassword")], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values) => {
      try {
        await updateUserProfile({
          type: "password",
          data: values,
        });
        toast.success("Profile updated successfully");
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <PasswordInput
          id="currentPassword"
          name="currentPassword"
          onChange={formik.handleChange}
          value={formik.values.currentPassword}
          error={formik.errors.currentPassword}
          touched={formik.touched.currentPassword}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <PasswordInput
          id="newPassword"
          name="newPassword"
          onChange={formik.handleChange}
          value={formik.values.newPassword}
          error={formik.errors.newPassword}
          touched={formik.touched.newPassword}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          onChange={formik.handleChange}
          value={formik.values.confirmPassword}
          error={formik.errors.confirmPassword}
          touched={formik.touched.confirmPassword}
        />
      </div>

      <Button type="submit" disabled={formik.isSubmitting}>
        Change Password
      </Button>
    </form>
  );
};

export default function Profile() {
  const userData = useStore($userData);

  return (
    <>
      <Breadcamb items={[{ label: "Profile" }]} />
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <p>{userData?.email}</p>
        </CardHeader>
        <CardContent>
          <ProfileForm userData={userData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <PasswordForm />
        </CardContent>
      </Card>
    </>
  );
}
