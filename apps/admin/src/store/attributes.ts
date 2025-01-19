import { atom, batched, computed, task } from "nanostores";
import { fetchData, postData, putData, deleteData } from "@/lib/fetch";

// Atoms
const $refreshTrigger = atom(0);
const $attributesLoading = atom(false);
const $attributesError = atom<string | null>(null);

// Computed store for attributes
const $attributes = batched([$refreshTrigger], (_) =>
  task(async () => {
    $attributesLoading.set(true); // Start loading
    $attributesError.set(null); // Clear previous errors

    try {
      return await fetchData(`/api/admin/attribute`);
    } catch (error: any) {
      $attributesError.set(
        error.message || "An error occurred while Attributes"
      );
      return null;
    } finally {
      $attributesLoading.set(false); // End loading
    }
  })
);

// Actions
const refetchAttributes = () => {
  $refreshTrigger.set($refreshTrigger.get() + 1);
};

const addAttribute = async (name: string) => {
  try {
    let data = await postData("/api/admin/attribute", { name });
    refetchAttributes();
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to add attribute");
  }
};

const updateAttribute = async (attributeId: string, name: string) => {
  try {
    let data = await putData("/api/admin/attribute", { attributeId, name });
    refetchAttributes();
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to update attribute");
  }
};

const deleteAttribute = async (attributeId: string) => {
  try {
    let data = await deleteData("/api/admin/attribute", { attributeId });
    refetchAttributes();
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete attribute");
  }
};

const addAttributeVariant = async (attributeId: string, name: string) => {
  try {
    let data = await postData("/api/admin/attribute/variant", {
      name,
      attributeId,
    });
    refetchAttributes();
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to add attribute variant");
  }
};

const updateAttributeVariant = async (
  attributeId: string,
  variantId: string,
  name: string
) => {
  try {
    let data = await putData("/api/admin/attribute/variant", {
      name,
      attributeId,
      variantId,
    });
    refetchAttributes();
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to update attribute variant");
  }
};

const deleteAttributeVariant = async (
  attributeId: string,
  variantId: string
) => {
  try {
    let data = await deleteData("/api/admin/attribute/variant", {
      attributeId,
      variantId,
    });
    refetchAttributes();
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete attribute variant");
  }
};

const updateAttributeVariants = async (attributeId: string, variants: any) => {
  try {
    let data = await putData("/api/admin/attribute", { attributeId, variants });
    refetchAttributes();
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to update attribute variants");
  }
};

export {
  $attributes,
  $attributesLoading,
  $attributesError,
  refetchAttributes,
  addAttribute,
  updateAttribute,
  deleteAttribute,
  addAttributeVariant,
  updateAttributeVariant,
  deleteAttributeVariant,
  updateAttributeVariants,
};
