import { atom, batched, task } from "nanostores";
import { fetchData, postData, putData, deleteData } from "@/lib/fetch";

const $refreshSiteSettingData = atom(1);

function refetchsiteSettingData() {
    $refreshSiteSettingData.set($refreshSiteSettingData.get() + 1);
}

//call siteSetting data when selectedDateType, startDate or endDate changes
const $siteSettingDataLoading = atom<boolean>(false);
const $siteSettingDataError = atom<string | null>(null);

const $siteSettingData = batched([$refreshSiteSettingData], (_) =>
    task(async () => {
        $siteSettingDataLoading.set(true); // Start loading
        $siteSettingDataError.set(null); // Clear previous errors

        try {
            return await fetchData(`/api/admin/frontend`);
        } catch (error: any) {
            $siteSettingDataError.set(
                error.message ||
                    "An error occurred while fetching siteSetting data."
            );
            return null;
        } finally {
            $siteSettingDataLoading.set(false); // End loading
        }
    })
);

type payloadType = {
    type: string;
    data: any;
};

const postSiteSettingData = async (data: payloadType) => {
    await postData(`/api/admin/frontend`, data);
    refetchsiteSettingData();
    return true;
};

const putSiteSettingData = async (data: payloadType) => {
    await putData(`/api/admin/frontend`, data);
    refetchsiteSettingData();
    return true;
};

const deleteSiteSettingData = async (data: payloadType) => {
    await deleteData(`/api/admin/frontend`, data);
    refetchsiteSettingData();
    return true;
};

export { $siteSettingData, $siteSettingDataLoading, $siteSettingDataError };

export {
    refetchsiteSettingData,
    postSiteSettingData,
    putSiteSettingData,
    deleteSiteSettingData,
};
