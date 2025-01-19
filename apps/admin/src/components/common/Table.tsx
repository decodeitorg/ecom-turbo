import React, { useEffect, useState } from "react";
import { FaEye, FaPencilAlt } from "react-icons/fa";
import {
  MdDeleteOutline,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/layout/sidebar/button";

import { Checkbox } from "@/components/ui/checkbox";
import { useIsMobile } from "@/hooks/use-mobile";

interface TableProps {
  data: any;
  columns: any[];
  indexed?: boolean;
  loading?: boolean;
  noActions?: boolean;
  actions?: (data: any) => any;
  onView?: (data: any) => void;
  onEdit?: (data: any) => void;
  onDelete?: (data: any) => Promise<any>;
  selectedRow?: any[];
  setSelectedRow?: (data: any) => void;
  onReload?: any;
  className?: string;
  bordered?: boolean;
  supportMobile?: boolean;
}
const CustomTable = ({
  data,
  columns,
  bordered = false,
  indexed,
  loading = false,
  actions,
  onView,
  onEdit,
  onDelete,
  onReload,
  noActions = false,
  className,
  selectedRow,
  setSelectedRow,
  supportMobile = false,
}: TableProps) => {
  const [page, setPage] = React.useState(1);
  const isMobile = useIsMobile();

  const [currentPage, setCurrentPage] = useState(page);

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  let cols = noActions
    ? columns
    : [
        ...columns,

        {
          name: "Action",
          uid: "no_actions",
          className: "w-auto text-right",
          formatter: (cell: any, data: any) => {
            return (
              <div className="justify-content-start flex items-center gap-1">
                {!!actions && data && actions(data)}
                {onView && (
                  <button
                    className="mr-2 rounded border border-green-500 p-1.5 text-green-500 hover:bg-green-500 hover:text-white"
                    title="View"
                    onClick={() => onView(data)}
                  >
                    {/* <FaEye /> */}
                  </button>
                )}

                {onEdit && data && (
                  <button
                    className="mr-2 rounded border border-blue-500 p-1.5 text-blue-500 hover:bg-blue-500 hover:text-white"
                    title="Edit"
                    onClick={() => onEdit(data)}
                  >
                    <FaPencilAlt />
                  </button>
                )}
                {onDelete && data && (
                  <button
                    className="rounded border border-red-500 p-1.5 text-red-500 hover:bg-red-500 hover:text-white"
                    title="Delete"
                    onClick={() => onDelete(data)}
                  >
                    <MdDeleteOutline className="h-4 w-4 text-red-500" />
                  </button>
                )}
              </div>
            );
          },
        },
      ];

  return (
    <section className={`w-full ${className}`}>
      {loading ? (
        <>
          {[1, 2, 3, 4].map((item, index) => (
            <Card className="mb-2 w-full space-y-3" key={index}>
              <Skeleton className="rounded-lg">
                <div className="bg-default-300 h-20 rounded-lg"></div>
              </Skeleton>
            </Card>
          ))}
        </>
      ) : (
        <>
          {isMobile && supportMobile ? (
            <div className="grid grid-cols-1 gap-4">
              {!!selectedRow && !!setSelectedRow && (
                <div className="flex items-center justify-start gap-2">
                  <Checkbox
                    checked={
                      selectedRow?.length ===
                      (data?.docs ? data?.docs : data)?.length
                    }
                    onCheckedChange={(checked) => {
                      setSelectedRow(
                        checked ? (data?.docs ? data?.docs : data) : []
                      );
                    }}
                  />{" "}
                  <p> Select all </p>
                </div>
              )}

              {data === null ||
              data?.length === 0 ||
              Object?.keys(data ?? {}).length === 0 ||
              data === undefined ? (
                <div className="py-8 text-center">No Data Found</div>
              ) : (
                (data?.docs ? data?.docs : data)?.map((row, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      {!!selectedRow && !!setSelectedRow && (
                        <div className="mb-2">
                          <Checkbox
                            checked={selectedRow
                              ?.map((item: any) => item._id)
                              .includes(row._id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedRow((old: any) => [...old, row]);
                              } else {
                                setSelectedRow((old: any) =>
                                  old.filter(
                                    (item: any) => item._id !== row._id
                                  )
                                );
                              }
                            }}
                          />
                        </div>
                      )}

                      <div className="space-y-3">
                        {cols?.map((column, colIndex) => (
                          <div
                            key={colIndex}
                            className="flex flex-col space-y-2"
                          >
                            <span className="border-b border-gray-700 pb-1 text-sm font-medium text-gray-500">
                              {column.name}
                            </span>
                            <span className="text-sm text-gray-700 dark:text-gray-400">
                              {column && column.formatter
                                ? column.formatter(row[column?.uid], row)
                                : row && row[column?.uid]
                                  ? row[column.uid]
                                  : "-"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          ) : (
            <div className="overflow-auto border border-gray-200 md:rounded-lg dark:border-gray-700">
              <table className="min-w-full table-auto divide-y divide-gray-200 overflow-auto dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    {!!selectedRow && !!setSelectedRow && (
                      <th scope="col">
                        <Checkbox
                          checked={
                            selectedRow?.length ===
                            (data?.docs ? data?.docs : data)?.length
                          }
                          onCheckedChange={(checked) => {
                            setSelectedRow(
                              checked ? (data?.docs ? data?.docs : data) : []
                            );
                          }}
                        />
                      </th>
                    )}
                    {indexed && <th scope="col">#</th>}

                    {cols?.map((column, index) => (
                      <th
                        scope="col"
                        className="px-2 py-3.5 text-left text-sm font-normal text-gray-500 rtl:text-right dark:text-gray-400"
                        key={index}
                      >
                        {column.name}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr className="bg-none">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </tr>
                  ) : (
                    <>
                      {data === null ||
                      data?.length === 0 ||
                      Object?.keys(data ?? {}).length === 0 ||
                      data === undefined ? (
                        <tr>
                          <td
                            colSpan={cols.length + 1}
                            className="py-8 text-center"
                          >
                            No Data Found
                          </td>
                        </tr>
                      ) : (
                        <>
                          {(data?.docs ? data?.docs : data)?.map(
                            (row, index) => (
                              <tr
                                key={index}
                                className={`${bordered ? "border-b" : ""}`}
                              >
                                {indexed && (
                                  <th scope="row">
                                    {(data?.docs
                                      ? (data?.page - 1) * data.limit
                                      : 0) +
                                      index +
                                      1}
                                  </th>
                                )}
                                {!!selectedRow && !!setSelectedRow && (
                                  <td className="whitespace-nowrap px-2">
                                    <Checkbox
                                      checked={selectedRow
                                        ?.map((item: any) => item._id)
                                        .includes(row._id)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setSelectedRow((old: any) => [
                                            ...old,
                                            row,
                                          ]);
                                        } else {
                                          setSelectedRow((old: any) =>
                                            old.filter(
                                              (item: any) =>
                                                item._id !== row._id
                                            )
                                          );
                                        }
                                      }}
                                    />
                                  </td>
                                )}
                                {cols?.map((column, index) => (
                                  <td
                                    key={index}
                                    className="whitespace-nowrap px-2 text-sm font-medium text-gray-700 dark:text-gray-400"
                                  >
                                    {column && column.formatter
                                      ? column.formatter(row[column?.uid], row)
                                      : row && row[column?.uid]
                                        ? row[column.uid]
                                        : "-"}
                                  </td>
                                ))}
                              </tr>
                            )
                          )}
                        </>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {Array.isArray(data?.docs) && (
        <div className="flex items-center justify-between overflow-auto px-2">
          <div className="hidden flex-1 text-sm text-muted-foreground sm:block">
            Total Items: {data.totalDocs}
          </div>
          <div className="flex items-center sm:space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="hidden text-sm font-medium sm:block">
                Rows per page
              </p>
              <Select
                value={data.limit.toString()}
                onValueChange={(value) => {
                  onReload({ limit: parseInt(value) });
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={data.limit} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 25, 50, 100].map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {currentPage} of {data.totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => {
                  setCurrentPage(1);
                  onReload({ page: 1 });
                }}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Go to first page</span>
                <MdKeyboardDoubleArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => {
                  const newPage = Math.max(1, currentPage - 1);
                  setCurrentPage(newPage);
                  onReload({ page: newPage });
                }}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => {
                  const newPage = Math.min(data.totalPages, currentPage + 1);
                  setCurrentPage(newPage);
                  onReload({ page: newPage });
                }}
                disabled={currentPage === data.totalPages}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => {
                  setCurrentPage(data.totalPages);
                  onReload({ page: data.totalPages });
                }}
                disabled={currentPage === data.totalPages}
              >
                <span className="sr-only">Go to last page</span>
                <MdKeyboardDoubleArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CustomTable;
