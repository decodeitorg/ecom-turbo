import Table from "@/components/common/Table";
import { useFetchData } from "@/hooks/hook";
import PageTitle from "@/components/Typography/PageTitle.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { IoRemoveSharp } from "react-icons/io5";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Breadcamb from "@/layout/Breadcamb";

export default function Users() {
  let [users, getUsers, setUsers, loading] = useFetchData(
    "/api/superadmin/users",
    {
      role: "Customer",
    }
  );

  return (
    <>
      {loading ? (
        <div>Loading</div>
      ) : (
        <>
          <Breadcamb items={[{ label: "Customers" }]} />
          <Card>
            <CardHeader>
              <CardTitle>Customers Information</CardTitle>
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
                          key={row._id}
                          src={row}
                          alt={row.name}
                          height={40}
                          width={40}
                          className="rounded-full"
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
                      return row?.phone?.number || "N/A";
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
                actions={(row) => {
                  return (
                    <div className="align-items-center flex justify-start">
                      <IoRemoveSharp
                        className="fw-bold mr-2 h-6 w-6"
                        onClick={() => {}}
                      />
                    </div>
                  );
                }}
              />
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
}
