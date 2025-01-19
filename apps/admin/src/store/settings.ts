import { atom, batched, task } from "nanostores";
import { fetchData, postData, putData, deleteData } from "@/lib/fetch";

const $refreshSettingData = atom(1);

function refetchSettingData() {
    $refreshSettingData.set($refreshSettingData.get() + 1);
}

//call Setting data when selectedDateType, startDate or endDate changes
const $SettingDataLoading = atom<boolean>(false);
const $SettingDataError = atom<string | null>(null);

const $SettingData = batched<any, null>([$refreshSettingData], (_) =>
    task(async () => {
        $SettingDataLoading.set(true); // Start loading
        $SettingDataError.set(null); // Clear previous errors

        try {
            return await fetchData(`/api/superadmin/settings`);
        } catch (error: any) {
            $SettingDataError.set(
                error.message ||
                    "An error occurred while fetching Setting data."
            );
            return null;
        } finally {
            $SettingDataLoading.set(false); // End loading
        }
    })
);

const postSettingData = async (data) => {
    const res = await postData(`/api/superadmin/settings`, data);
    refetchSettingData();
    return res;
};

export { $SettingData, $SettingDataLoading, $SettingDataError };

export { refetchSettingData, postSettingData };
