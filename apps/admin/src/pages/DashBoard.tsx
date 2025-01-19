import DashboardOrderCount from "@/components/dashboard/DashboardOrderCount.tsx";
import TopSellingProductStats from "@/components/dashboard/TopSellingProductStats.tsx";
import {
  $dashboardData,
  $dashboardDataError,
  $dashboardDataLoading,
} from "@/store/dashBoard.ts";
import PageTitle from "@/components/Typography/PageTitle.tsx";
import { useStore } from "@nanostores/react";

import ProductSold from "../components/dashboard/ProductSold.tsx";
import SalesComposedChart from "../components/dashboard/SalesComposedChart.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import Breadcamb from "../layout/Breadcamb.tsx";

type GraphDataForSalePerDayType = {
  date: string;
  totalSales: number;
  _id: string;
}[];

type PerProductSoldType = {
  name: string;
  totalPurchased: number;
  logo: string;
  totalSalePrice: number;
}[];

const Dashboard = () => {
  const dashboardData = useStore($dashboardData);
  const dashboardDataLoading = useStore($dashboardDataLoading);
  const dashboardDataError = useStore($dashboardDataError);

  if (dashboardDataLoading) return <h1>Loading...</h1>;
  if (dashboardDataError) return <h1 color="error">{dashboardDataError}</h1>;
  if (!dashboardData) return null;

  const {
    topSellingProductStats,
    dashboardOrderCount,
    graphDataForSalePerDay,
    totalSalesAmount,
    PerProductSold,
  } = dashboardData as {
    topSellingProductStats: any;
    dashboardOrderCount: any;
    graphDataForSalePerDay: GraphDataForSalePerDayType;
    totalSalesAmount: number;
    PerProductSold: PerProductSoldType;
  };

  return (
    <section className="space-y-6">
      <Breadcamb items={[{ label: "Dashboard" }]} />

      {/* <CardTitle className="mb-5">Dashboard Overview</CardTitle> */}

      <DashboardOrderCount dashboardOrderCount={dashboardOrderCount} />

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-12">
        <div className="col-span-6 h-96">
          <TopSellingProductStats
            topSellingProductStats={topSellingProductStats}
          />
        </div>
        <div className="col-span-6 h-96">
          <ProductSold PerProductSold={PerProductSold} />
        </div>
      </div>

      <SalesComposedChart graphDataForSalePerDay={graphDataForSalePerDay} />
    </section>
  );
};

export default Dashboard;
