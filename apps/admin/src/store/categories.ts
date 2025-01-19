import { atom, batched, computed, task } from "nanostores";
import { fetchData, postData, putData, deleteData } from "@/lib/fetch";

const $refreshCategories = atom(1);

function refetchCategories() {
  $refreshCategories.set($refreshCategories.get() + 1);
}

//call siteSetting data when selectedDateType, startDate or endDate changes
const $categoriesLoading = atom<boolean>(false);
const $categoriesError = atom<string | null>(null);

const $categories = batched([$refreshCategories], (_) =>
  task(async () => {
    $categoriesLoading.set(true); // Start loading
    $categoriesError.set(null); // Clear previous errors

    try {
      return await fetchData(`/api/admin/categories`);
    } catch (error: any) {
      $categoriesError.set(
        error.message || "An error occurred while Categories"
      );
      throw error;
    } finally {
      $categoriesLoading.set(false); // End loading
    }
  })
);

// const $categories = computed($categoriesData, (categoriesData) => {
//   return categoriesData;
// });

interface PostCategoryPayload {
  name: string;
  icon: string;
  youtubeLink: string;
  description: string;
  parentId: string | null;
}

const postCategories = async (data: PostCategoryPayload): Promise<boolean> => {
  try {
    await postData(`/api/admin/categories`, data);
    refetchCategories();
    return true;
  } catch (error) {
    throw error;
  }
};

interface PutCategoryPayload {
  _id: string;
  name?: string;
  description?: string;
  icon?: string;
  youtubeLink?: string;
  status?: string;
  specification?: string;
  specificationType?: string;
  attribute?: string;
  attributeType?: string;
}

const putCategories = async (data: PutCategoryPayload): Promise<boolean> => {
  try {
    await putData(`/api/admin/categories`, data);
    refetchCategories();
    return true;
  } catch (error) {
    throw error;
  }
};

interface DeleteCategoryPayload {
  _id: string;
}
const deleteCategories = async (data: DeleteCategoryPayload) => {
  try {
    await deleteData(`/api/admin/categories`, data);
    refetchCategories();
    return true;
  } catch (error) {
    throw error;
  }
};

export { $categories, $categoriesLoading, $categoriesError };
export { refetchCategories, postCategories, putCategories, deleteCategories };
