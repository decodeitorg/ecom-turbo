import { $dashboardDataError, $dashboardDataLoading } from "@/store/dashBoard";
import { useStore } from "@nanostores/react";

import { FiCheck, FiRefreshCw, FiShoppingCart, FiTruck } from "react-icons/fi";
import DashboardOrderCountCard from "@/components/common/DashboardOrderCountCard";

const DashboardOrderCount = ({ dashboardOrderCount }: any) => {
    const dashboardDataLoading = useStore($dashboardDataLoading);
    const dashboardDataError = useStore($dashboardDataError);

    if (dashboardDataLoading) return <h1>Loading...</h1>;
    if (dashboardDataError) return <h1 color="error">{dashboardDataError}</h1>;

    // return <></>;
    return (
        <>
            <div className="mb-8 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 xl:grid-cols-4">
                <DashboardOrderCountCard
                    title={"Total Orders"}
                    href="/admin/orders"
                    Icon={FiShoppingCart}
                    loading={dashboardDataLoading}
                    quantity={dashboardOrderCount?.total?.count || 0}
                    amount={dashboardOrderCount?.total?.total || 0}
                    className="bg-orange-100 text-orange-600 dark:bg-orange-500 dark:text-orange-100"
                />
                <DashboardOrderCountCard
                    title={"Order Pending"}
                    href="/admin/orders/pending"
                    Icon={FiRefreshCw}
                    loading={dashboardDataLoading}
                    quantity={dashboardOrderCount?.pending?.count || 0}
                    amount={dashboardOrderCount?.pending?.total || 23}
                    className="bg-blue-100 text-blue-600 dark:bg-blue-500 dark:text-blue-100"
                />
                <DashboardOrderCountCard
                    title={"Order Processing"}
                    href="/admin/orders/processing"
                    Icon={FiTruck}
                    loading={dashboardDataLoading}
                    quantity={dashboardOrderCount?.processing?.count || 0}
                    amount={dashboardOrderCount?.processing?.total || 0}
                    className="bg-teal-100 text-teal-600 dark:bg-teal-500 dark:text-teal-100"
                />
                <DashboardOrderCountCard
                    title={"Order OnDelivery"}
                    href="/admin/orders/onDelivery"
                    Icon={FiTruck}
                    loading={dashboardDataLoading}
                    quantity={dashboardOrderCount?.onDelivery?.count || 0}
                    amount={dashboardOrderCount?.onDelivery?.total || 0}
                    className="bg-yellow-100 text-yellow-600 dark:bg-yellow-500 dark:text-yellow-100"
                />
                <DashboardOrderCountCard
                    title={"Order Delivered"}
                    href="/admin/orders/delivered"
                    Icon={FiCheck}
                    loading={dashboardDataLoading}
                    quantity={dashboardOrderCount?.delivered?.count || 0}
                    amount={dashboardOrderCount?.delivered?.total || 0}
                    className="bg-green-100 text-green-600 dark:bg-green-500 dark:text-green-100"
                />
                <DashboardOrderCountCard
                    title={"Order Cancelled"}
                    href="/admin/orders/cancelled"
                    Icon={FiRefreshCw}
                    loading={dashboardDataLoading}
                    quantity={dashboardOrderCount?.cancelled?.count || 0}
                    amount={dashboardOrderCount?.cancelled?.total || 0}
                    className="bg-red-100 text-red-600 dark:bg-red-500 dark:text-red-100"
                />
            </div>
        </>
    );
};

export default DashboardOrderCount;
