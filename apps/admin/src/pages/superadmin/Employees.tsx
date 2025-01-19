import Table from "@/components/common/Table";
import FileUpload from "@/components/common/Upload";
import { deleteData, postData, putData, useFetchData } from "@/hooks/hook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useFormik } from "formik";
import { useState } from "react";
import { object, string } from "yup";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListFilter } from "lucide-react";
import { Label } from "@/components/ui/label";
import { set } from "mongoose";
import Breadcamb from "@/layout/Breadcamb";

export default function Employees() {
  let [employeeType, setEmployeeType] = useState("AllEmployees");
  let [users, getUsers, setUsers, loading] = useFetchData(
    "/api/superadmin/users",
    {
      role: employeeType,
    }
  );

  let [isEdit, setIsEdit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      _id: "",
      name: "",
      email: "",
      phone: { number: "", verified: false, otp: "" },
      password: "",
      role: "",
      image: "",
    },
    validationSchema: object().shape({
      name: string()
        .min(3, "Name must be at least 3 characters")
        .required("Name is required"),
      email: string().email("Email is not valid").required("Email is required"),
      phone: object().shape({
        number: string()
          .matches(
            /^(?:\+88|01)?(?:\d{11}|\d{13})$/,
            "Phone number is not valid"
          )
          .required("Phone number is required"),
      }),
      password: isEdit
        ? string().min(8, "Password must be at least 8 characters")
        : string()
            .required("Password is required")
            .min(8, "Password must be at least 8 characters"),
      role: string()
        .oneOf(["Admin", "SuperAdmin"], "Invalid Role")
        .required("Role is required"),
      image: string().required("Image is required"),
    }),
    onSubmit: async (values) => {
      if (isEdit) {
        await putData(`/api/superadmin/users`, values);
      } else {
        if (values.password === "") alert("Password is required");
        else {
          delete values._id;
          await postData("/api/superadmin/users", values);
        }
      }
      formik.resetForm();
      setIsEdit(false);
      getUsers();
      setIsOpen(false);
    },
  });

  return (
    <>
      <Breadcamb items={[{ label: "Employees" }]} />
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            Employee Information
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Filter
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Filter Employees</DialogTitle>

                    <DialogDescription>
                      Filter Employees by their role
                    </DialogDescription>
                  </DialogHeader>

                  <Select
                    onValueChange={(value) => {
                      setEmployeeType(value);
                      getUsers({ role: value });
                    }}
                    defaultValue={employeeType}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Employee Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="AllEmployees" value="AllEmployees">
                        All Employee
                      </SelectItem>
                      <SelectItem key="Admin" value="Admin">
                        Admin
                      </SelectItem>
                      <SelectItem key="SuperAdmin" value="SuperAdmin">
                        SuperAdmin
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </DialogContent>
              </Dialog>

              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger>
                  <Button color="primary">+</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {isEdit ? "Edit" : "Add"} Employee
                    </DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={formik.handleSubmit}
                    className="flex flex-col gap-4"
                    autoComplete="off"
                  >
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        required
                        type="text"
                        name="name"
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        className="rounded-lg border border-black"
                      />
                      <span className="text-red-500">
                        {formik.errors.name &&
                          formik.touched.name &&
                          formik.errors.name}
                      </span>
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        required
                        type="email"
                        name="email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        className="rounded-lg border border-black"
                      />
                      <span className="text-red-500">
                        {formik.errors.email &&
                          formik.touched.email &&
                          formik.errors.email}
                      </span>
                    </div>

                    {isEdit ? (
                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          type="text"
                          name="password"
                          onChange={formik.handleChange}
                          value={formik.values.password}
                          className="rounded-lg border border-black"
                        />
                        <span className="text-red-500">
                          {formik.errors.password &&
                            formik.touched.password &&
                            formik.errors.password}
                        </span>
                      </div>
                    ) : (
                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          required
                          type="text"
                          name="password"
                          onChange={formik.handleChange}
                          value={formik.values.password}
                          className="rounded-lg border border-black"
                        />
                        <span className="text-red-500">
                          {formik.errors.password &&
                            formik.touched.password &&
                            formik.errors.password}
                        </span>
                      </div>
                    )}

                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        type="text"
                        name="phone"
                        onChange={(e) => {
                          formik.setFieldValue("phone", {
                            number: e.target.value,
                            verified: false,
                            otp: "",
                          });
                        }}
                        value={formik.values.phone?.number}
                        className="rounded-lg border border-black"
                      />
                      <span className="text-red-500">
                        {formik.errors.phone?.number &&
                          formik.touched.phone?.number &&
                          formik.errors.phone?.number}
                      </span>
                    </div>

                    <Select
                      required
                      value={formik.values.role}
                      onValueChange={(value) => {
                        formik.setFieldValue("role", value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem key="Admin" value="Admin">
                          Admin
                        </SelectItem>
                        <SelectItem key="SuperAdmin" value="SuperAdmin">
                          SuperAdmin
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-red-500">
                      {formik.errors.role &&
                        formik.touched.role &&
                        formik.errors.role}
                    </span>

                    <FileUpload
                      value={formik.values.image}
                      onChange={(value) => formik.setFieldValue("image", value)}
                      type="single"
                      allowedFileTypes={[".png", ".jpg", ".jpeg"]}
                      className="w-full"
                      title="Upload Image"
                    />
                    {formik.errors.image && formik.touched.image && (
                      <span className="text-red-500">
                        {formik.errors.image}
                      </span>
                    )}

                    <Button type="submit" disabled={formik.isSubmitting}>
                      Submit
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table
            data={users}
            columns={[
              {
                name: "Image",
                uid: "image",
                formatter: (row) => {
                  return (
                    <img
                      loading="lazy"
                      key={row._id}
                      src={row}
                      alt={row.name}
                      height={40}
                      width={40}
                    />
                  );
                },
              },
              {
                name: "Name",
                uid: "name",
              },
              {
                name: "Email",
                uid: "email",
              },
              {
                name: "Phone",
                uid: "phone",
                formatter: (row) => {
                  return <span>{row.phone?.number ?? ""}</span>;
                },
              },
              {
                name: "Role",
                uid: "role",
                render: (row) => {
                  return <Badge color="primary">{row.role}</Badge>;
                },
              },
            ]}
            onReload={getUsers}
            loading={loading}
            onEdit={(row) => {
              setIsEdit(true);
              formik.setFieldValue("_id", row._id);
              formik.setFieldValue("name", row.name);
              formik.setFieldValue("email", row.email);
              formik.setFieldValue(
                "phone",
                row.phone === ""
                  ? { number: "", verified: false, otp: "" }
                  : row.phone
              );
              formik.setFieldValue("role", row.role);
              formik.setFieldValue("image", row.image);
              setIsOpen(true);
            }}
            onDelete={async (row) => {
              if (
                window.confirm("Are you sure you want to delete this user?")
              ) {
                await deleteData("/api/superadmin/users", { _id: row._id });
                getUsers();
              }
            }}
          />
        </CardContent>
      </Card>
    </>
  );
}
