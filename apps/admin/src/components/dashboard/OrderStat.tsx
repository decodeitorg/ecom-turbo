import { useFetchData } from "@/hooks/hook";
import React from "react";
import { useEffect, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { ImCreditCard, ImStack } from "react-icons/im";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

// import PieChart from "./chart/Pie/PieChart.tsx";

const DashboardOrderStat = () => {
  const [todayOrderAmount, setTodayOrderAmount] = useState(0);
  const [yesterdayOrderAmount, setYesterdayOrderAmount] = useState(0);
  const [todayCashPayment, setTodayCashPayment] = useState(0);
  const [todayCardPayment, setTodayCardPayment] = useState(0);
  const [todayCreditPayment, setTodayCreditPayment] = useState(0);
  const [yesterdayCashPayment, setYesterdayCashPayment] = useState(0);
  const [yesterdayCardPayment, setYesterdayCardPayment] = useState(0);
  const [yesterdayCreditPayment, setYesterdayCreditPayment] = useState(0);

  const [salesReport, setSalesReport] = useState([]);

  const [
    dashboardOrderAmount,
    getDashboardOrderAmount,
    setDashboardOrderAmount,
    loadingOrderAmount,
  ] = useFetchData("/api/admin/orders/dashboard-ammount");

  // const { data: bestSellerProductChart, loading: loadingBestSellerProduct } =
  //     useAsync(OrderServices.getBestSellerProductChart);

  const [
    bestSellerProductChart,
    getBestSellerProductChart,
    setBestSellerProductChart,
    loadingBestSellerProduct,
  ] = useFetchData(api.bestSellerProductChart.url);

  function isToday(date) {
    return (
      date.getDate() === new Date().getDate() &&
      date.getMonth() === new Date().getMonth() &&
      date.getFullYear() === new Date().getFullYear()
    );
  }

  function isYesterday(date) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    );
  }

  function isBetween(date, startDate, endDate, inclusive = true) {
    // Convert all arguments to Date objects
    const checkDate = new Date(date);
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (inclusive) {
      return checkDate >= start && checkDate <= end;
    } else {
      return checkDate > start && checkDate < end;
    }
  }

  useEffect(() => {
    //     // today orders show
    const todayOrder = dashboardOrderAmount?.ordersData?.filter((order) =>
      isToday(new Date(order.updatedAt))
    );
    //
    const todayReport = todayOrder?.reduce((pre, acc) => pre + acc.total, 0);
    setTodayOrderAmount(todayReport);

    // yesterday orders
    const yesterdayOrder = dashboardOrderAmount?.ordersData?.filter((order) =>
      isYesterday(new Date(order.updatedAt))
    );

    const yesterdayReport = yesterdayOrder?.reduce(
      (pre, acc) => pre + acc.total,
      0
    );
    setYesterdayOrderAmount(yesterdayReport);

    // sales orders chart data
    const salesOrderChartData = dashboardOrderAmount?.ordersData?.filter(
      (order) =>
        isBetween(
          order.updatedAt,
          new Date().setDate(new Date().getDate() - 7),
          new Date()
        )
    );

    salesOrderChartData?.reduce((res, value) => {
      let onlyDate = value.updatedAt.split("T")[0];

      if (!res[onlyDate]) {
        res[onlyDate] = { date: onlyDate, total: 0, order: 0 };
        salesReport.push(res[onlyDate]);
      }
      res[onlyDate].total += value.total;
      res[onlyDate].order += 1;
      return res;
    }, {});

    setSalesReport(salesReport);

    const todayPaymentMethodData = [];
    const yesterDayPaymentMethodData = [];

    // today order payment method
    dashboardOrderAmount?.ordersData?.filter((item, value) => {
      if (isToday(new Date(item.updatedAt))) {
        if (item.paymentMethod === "Cash") {
          let cashMethod = {
            paymentMethod: "Cash",
            total: item.total,
          };
          todayPaymentMethodData.push(cashMethod);
        }

        if (item.paymentMethod === "Credit") {
          const cashMethod = {
            paymentMethod: "Credit",
            total: item.total,
          };

          todayPaymentMethodData.push(cashMethod);
        }

        if (item.paymentMethod === "Card") {
          const cashMethod = {
            paymentMethod: "Card",
            total: item.total,
          };

          todayPaymentMethodData.push(cashMethod);
        }
      }

      return item;
    });
    // yesterday order payment method
    dashboardOrderAmount?.ordersData?.filter((item, value) => {
      if (isYesterday(new Date(item.updatedAt))) {
        if (item.paymentMethod === "Cash") {
          let cashMethod = {
            paymentMethod: "Cash",
            total: item.total,
          };
          yesterDayPaymentMethodData.push(cashMethod);
        }

        if (item.paymentMethod === "Credit") {
          const cashMethod = {
            paymentMethod: "Credit",
            total: item?.total,
          };

          yesterDayPaymentMethodData.push(cashMethod);
        }

        if (item.paymentMethod === "Card") {
          const cashMethod = {
            paymentMethod: "Card",
            total: item?.total,
          };

          yesterDayPaymentMethodData.push(cashMethod);
        }
      }

      return item;
    });

    const todayCsCdCit = Object.values(
      todayPaymentMethodData.reduce((r, { paymentMethod, total }) => {
        if (!r[paymentMethod]) {
          r[paymentMethod] = { paymentMethod, total: 0 };
        }
        r[paymentMethod].total += total;

        return r;
      }, {})
    );
    const today_cash_payment = todayCsCdCit.find(
      (el) => el.paymentMethod === "Cash"
    );
    setTodayCashPayment(today_cash_payment?.total);
    const today_card_payment = todayCsCdCit.find(
      (el) => el.paymentMethod === "Card"
    );
    setTodayCardPayment(today_card_payment?.total);
    const today_credit_payment = todayCsCdCit.find(
      (el) => el.paymentMethod === "Credit"
    );
    setTodayCreditPayment(today_credit_payment?.total);

    const yesterDayCsCdCit = Object.values(
      yesterDayPaymentMethodData.reduce((r, { paymentMethod, total }) => {
        if (!r[paymentMethod]) {
          r[paymentMethod] = { paymentMethod, total: 0 };
        }
        r[paymentMethod].total += total;

        return r;
      }, {})
    );

    const yesterday_cash_payment = yesterDayCsCdCit.find(
      (el) => el.paymentMethod === "Cash"
    );
    setYesterdayCashPayment(yesterday_cash_payment?.total);
    const yesterday_card_payment = yesterDayCsCdCit.find(
      (el) => el.paymentMethod === "Card"
    );
    setYesterdayCardPayment(yesterday_card_payment?.total);
    const yesterday_credit_payment = yesterDayCsCdCit.find(
      (el) => el.paymentMethod === "Credit"
    );
    setYesterdayCreditPayment(yesterday_credit_payment?.total);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardOrderAmount]);

  let currency = "৳";

  return (
    <>
      <div className="grid gap-4 md:grid-cols-4 xl:grid-cols-4">
        <DashboardOrderAmountCard
          currency={currency}
          title="Today Order"
          title2="TodayOrder"
          Icon={ImStack}
          cash={todayCashPayment || 0}
          card={todayCardPayment || 0}
          credit={todayCreditPayment || 0}
          price={todayOrderAmount || 0}
          className="dark:bg-dark-800 text-black dark:text-white"
          loading={loadingOrderAmount}
        />

        <DashboardOrderAmountCard
          currency={currency}
          title="Yesterday Order"
          title2="YesterdayOrder"
          Icon={ImStack}
          cash={yesterdayCashPayment || 0}
          card={yesterdayCardPayment || 0}
          credit={yesterdayCreditPayment || 0}
          price={yesterdayOrderAmount || 0}
          className="dark:bg-dark-800 text-black dark:text-white"
          loading={loadingOrderAmount}
        />

        <DashboardOrderAmountCard
          currency={currency}
          title2="ThisMonth"
          Icon={FiShoppingCart}
          price={dashboardOrderAmount?.thisMonthlyOrderAmount || 0}
          className="dark:bg-dark-800 text-black dark:text-white"
          loading={loadingOrderAmount}
        />

        <DashboardOrderAmountCard
          currency={currency}
          title2="AllTimeSales"
          Icon={ImCreditCard}
          price={dashboardOrderAmount?.totalAmount || 0}
          className="dark:bg-dark-800 text-black dark:text-white"
          loading={loadingOrderAmount}
        />
      </div>
      <div className="my-8 grid gap-4 md:grid-cols-2">
        <ChartCard loading={loadingOrderAmount} title={"WeeklySales"}>
          {/* <LineChart salesReport={salesReport} /> */}
        </ChartCard>

        <ChartCard
          loading={loadingBestSellerProduct}
          title={"BestSellingProducts"}
        >
          {/* <PieChart data={bestSellerProductChart} /> */}
        </ChartCard>
      </div>
    </>
  );
};

export default DashboardOrderStat;

interface DashboardOrderAmountCardProps {
  mode?: string;
  title?: string;
  Icon?: any;
  className?: string;
  price?: number;
  currency?: string;
  cash?: number;
  card?: number;
  credit?: number;
  loading?: boolean;
  title2?: string;
}
const DashboardOrderAmountCard: React.FC<DashboardOrderAmountCardProps> = ({
  mode,
  title,
  Icon,
  className,
  price,
  currency,
  cash,
  card,
  credit,
  loading,
  title2,
}) => {
  return (
    <>
      {loading ? (
        <Skeleton
          count={4}
          height={40}
          className="bg-gray-200 dark:bg-gray-800"
          baseColor={`${mode === "dark" ? "#010101" : "#f9f9f9"}`}
          highlightColor={`${mode === "dark" ? "#1a1c23" : "#f8f8f8"} `}
        />
      ) : (
        <>
          {title === "Today Order" || title === "Yesterday Order" ? (
            <Card className={`flex h-full justify-center shadow-lg`}>
              <CardContent
                className={`w-full justify-between rounded-lg border border-gray-200 p-6 dark:border-gray-800 ${className}`}
              >
                <div className="mb-3 text-center xl:mb-0">
                  <div
                    className={`inline-block text-center text-3xl ${className}`}
                  >
                    <Icon />
                  </div>
                  <div>
                    <p className="mb-3 text-base font-medium">
                      {title2 ? (
                        t(`${title2}`)
                      ) : (
                        <Skeleton count={1} height={20} />
                      )}
                    </p>
                    <p className="text-2xl font-bold leading-none">
                      {/* ${Math.round(price)} */}
                      {}
                      {Number(price)?.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex text-center text-xs font-normal">
                    <div className="mt-3 px-1">
                      {"Cash"} : {currency}
                      {parseFloat(cash).toFixed(2)}
                    </div>
                    <div className="mt-3 px-1">
                      {"Card"} : {currency}
                      {parseFloat(card).toFixed(2)}
                    </div>
                    <div className="mt-3 px-1">
                      {"Credit"} : {currency}
                      {parseFloat(credit).toFixed(2)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="flex h-full justify-center text-center shadow-lg">
              <CardContent
                className={`w-full rounded-lg border border-gray-200 p-6 dark:border-gray-800 ${className}`}
              >
                <div
                  className={`inline-block text-center text-3xl ${className}`}
                >
                  <Icon />
                </div>
                <div>
                  <p className="mb-3 text-base font-medium">{`${title2}`}</p>
                  <p className="text-2xl font-bold leading-none">
                    {/* ${Math.round(price)} */}
                    {currency}
                    {Number(price)?.toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </>
  );
};

interface ChartProps {
  title?: string;
  loading?: boolean;
  mode?: string;
  children?: React.ReactNode;
}

const ChartCard: React.FC<ChartProps> = ({
  children,
  title,
  loading,
  mode,
}) => {
  return (
    <div className="min-w-0 rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
      <p className="mb-4 font-semibold text-gray-800 dark:text-gray-300">
        {loading ? (
          <Skeleton
            count={1}
            height={20}
            className="bg-gray-200 dark:bg-gray-800"
            baseColor={`${mode === "dark" ? "#010101" : "#f9f9f9"}`}
            highlightColor={`${mode === "dark" ? "#1a1c23" : "#f8f8f8"} `}
          />
        ) : (
          title
        )}
      </p>

      {title === "Best Selling Products" ? (
        <>
          {loading ? (
            <div className="flex justify-center">
              <Skeleton
                className="bg-gray-200 dark:bg-gray-800"
                baseColor={`${mode === "dark" ? "#010101" : "#f9f9f9"}`}
                highlightColor={`${mode === "dark" ? "#1a1c23" : "#f8f8f8"} `}
                count={1}
                width={250}
                height={250}
                circle
              />
            </div>
          ) : (
            children
          )}
        </>
      ) : (
        <>
          {loading ? (
            <Skeleton
              className="bg-gray-200 dark:bg-gray-800"
              baseColor={`${mode === "dark" ? "#010101" : "#f9f9f9"}`}
              highlightColor={`${mode === "dark" ? "#1a1c23" : "#f8f8f8"} `}
              count={13}
              height={20}
            />
          ) : (
            children
          )}
        </>
      )}
    </div>
  );
};
