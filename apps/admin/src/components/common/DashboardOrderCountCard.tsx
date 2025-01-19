import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { useNavigate } from "react-router-dom";

interface DashboardOrderCountCardProps {
  title?: string;
  Icon?: any;
  quantity?: number;
  amount?: number;
  className?: string;
  loading?: boolean;
  mode?: string;
  pending?: boolean;
  todayPending?: number;
  olderPending?: number;
  href?: string;
}

const DashboardOrderCountCard: React.FC<DashboardOrderCountCardProps> = ({
  title,
  Icon,
  quantity,
  amount,
  className,
  loading,
  mode,
  pending,
  todayPending,
  olderPending,
  href,
}) => {
  const navigate = useNavigate();
  return (
    <>
      {loading ? (
        <Card className="p-3">
          <div className="flex w-full items-center gap-3">
            <div>
              <Skeleton className="flex h-12 w-12 rounded-full" />
            </div>
            <div className="flex w-full flex-col gap-2">
              <Skeleton className="h-3 w-3/5 rounded-lg" />
              <Skeleton className="h-3 w-12 rounded-lg" />
            </div>
          </div>
        </Card>
      ) : (
        <Card className="cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105">
          <CardContent
            className="flex items-center px-3 py-5"
            onClick={() => {
              if (href) navigate(href);
            }}
          >
            <div
              className={`mr-4 flex h-12 w-12 items-center justify-center rounded-full text-center text-lg ${className}`}
            >
              <Icon />
            </div>
            <div className="flex flex-col">
              {/* <p className="text-md">NextUI</p>
                              <p className="text-small text-default-500">
                                  nextui.org
                              </p> */}
              <div>
                <h6 className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                  <span>{title}</span>{" "}
                </h6>
                {pending && (
                  <div className="mb-1 grid w-full grid-cols-2 gap-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    <div>
                      <span className="font-semibold">Today</span>{" "}
                      <span className="text-sm font-semibold text-blue-600">
                        ({parseFloat(todayPending || 0).toFixed(2)})
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">Older</span>{" "}
                      <span className="text-sm font-semibold text-orange-400">
                        ({parseFloat(olderPending || 0).toFixed(2)})
                      </span>
                    </div>
                  </div>
                )}

                <p className="font-bold leading-none text-gray-600 dark:text-gray-200">
                  <span className="text-2xl">{quantity} </span> - {amount}৳
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default DashboardOrderCountCard;
