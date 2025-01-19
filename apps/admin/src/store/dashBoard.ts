import { fetchData } from "@/lib/fetch";
import { allTasks, atom, batched, computed, onMount, task } from "nanostores";

type selectedDateTypeType = "month" | "year" | "range";

const now = new Date();
// Calculate the first day of the current month at the first hour
const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
// Calculate the last day of the current month at the last hour
const lastDayOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59
);

const $selectedDateType = atom<selectedDateTypeType>("month");
const $startDate = atom<Date>(firstDayOfMonth);
const $endDate = atom<Date>(lastDayOfMonth);
const $refetchDashboardData = atom(1);

//call dashboard data when selectedDateType, startDate or endDate changes
const $dashboardDataLoading = atom<boolean>(false);
const $dashboardDataError = atom<string | null>(null);
const $dashboardData = batched(
    [$startDate, $endDate, $refetchDashboardData],
    (startDate, endDate, refetchDashboardData) =>
        task(async () => {
            $dashboardDataLoading.set(true); // Start loading
            $dashboardDataError.set(null); // Clear previous errors

            try {
                const data = await await fetchData(
                    `/api/admin/dashboard/dashboard-stats?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
                );

                return data;
            } catch (error: any) {
                $dashboardDataError.set(
                    error.message ||
                        "An error occurred while fetching dashboard data."
                );
                return null;
            } finally {
                $dashboardDataLoading.set(false); // End loading
            }
        })
);

const refetchDashboardData = () => {
    $refetchDashboardData.set($refetchDashboardData.get() + 1);
};

export { $selectedDateType, $startDate, $endDate };
export { $dashboardData, $dashboardDataLoading, $dashboardDataError };
export { refetchDashboardData };
