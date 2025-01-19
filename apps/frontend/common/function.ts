import { Attribute } from './types';

/**
 * This function populates the product variantsAttributes with the corresponding attributes.
 *
 * @param {Attribute[]} attributes - The list of attributes to be populated.
 * @param {Object} variantsAttributes - An object where the key is the attribute ID and the value is an array of variant IDs.
 * @returns {Attribute[]} - The list of attributes with their corresponding variants populated.
 */
export function populateVariantsAttributes(
  attributes: Attribute[],
  variantsAttributes: {
    [key: string]: string[];
  },
): Attribute[] {
  let populated = Object?.keys(variantsAttributes ?? {}).map((key) => {
    let attribute = attributes?.find((attr) => attr._id === key);
    if (!attribute) return null;
    let variants = variantsAttributes[key].map((variantId) => {
      return attribute?.variants.find((variant) => variant?._id === variantId);
    });
    return {
      ...attribute,
      variants,
    };
  });

  //filter out null values
  populated = populated.filter((attr) => attr !== null);

  return populated as Attribute[];
}

export const logOut = async () => {
  let res = await fetch('/api/auth/logout', {
    method: 'POST',
  });
  if (!res.ok) {
    errorAlert('Error logging out');
    return;
  }
  localStorage.removeItem('token');
  window.location.href = '/';
};

export async function login(email: string, password: string) {
  try {
    let res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      let data = await res.json();
      let token = data.data.token;
      let userData = data.data.userData;
      return { token, userData };
    } else {
      return new Error('Error logging in');
    }
  } catch (error) {
    return error;
  }
}
