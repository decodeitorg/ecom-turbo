import { priceRange } from "@/lib/price.ts";

/*
This function is used to populate the product attributes with the variants.
It takes two arguments, variants and attributes.
   variants: The variants of the product.
   attributes: The attributes of the product.
It returns the attributes with the variants populated.
*/
export function variantToAttribute(variants, attributes) {
  let newattributes = JSON.parse(JSON.stringify(attributes));
  return newattributes.filter((item) => {
    let values = variants.map((variant) => variant[item._id]).filter(Boolean);
    if (values.length > 0) {
      item.variants = item.variants.filter((variant) =>
        values.includes(variant._id.toString())
      );
      return true;
    }
    return false;
  });
}

/* 
This function is used to populate the product attributes with the variants.
It takes two arguments, product and attributes.
   product: The product object which contains the variants.
   attributes: The attributes of the product.
It returns the attributes with the variants populated.
*/
export function selectProductVariantFromURLParams(
  product,
  productAttributesPopulated,
  Astro
) {
  let selectedProductVariants = {};

  let url = Astro.url;
  let searchparams = new URLSearchParams(url.search);
  let searchParamsKeyValues = Array.from(searchparams.entries());
  if (searchparams.toString() === "") {
    selectedProductVariants = product.variants[0];
  } else {
    let variants_id = {};
    for (let [key, value] of searchParamsKeyValues) {
      let attribute = productAttributesPopulated.find(
        (item) => item.name.toLowerCase() === key.toLowerCase()
      );
      if (attribute) {
        let variant = attribute.variants.find(
          (item) => item.name.toLowerCase() === value.toLowerCase()
        );
        if (variant) {
          variants_id[attribute._id] = variant._id.toString();
        }
      }
    }

    selectedProductVariants =
      product.variants.find((variant) => {
        for (const key in variants_id) {
          if (!(key in variant && variant[key] === variants_id[key])) {
            return false;
          }
        }
        return true;
      }) || product.variants[0];
  }

  return selectedProductVariants;
}

/*
This function is used to generate the query string and name of the variant.
It takes two arguments, variant and attributes.
   variant: The variant object.
   attributes: The attributes of the product.
It returns an object with the query string and name of the variant.
*/
export function generateVariantQueryStringAndName(variant, attributes) {
  let url = "";
  let nameOfVariant = "";
  let keys = Object.keys(variant);
  let populated = keys.forEach((key, index) => {
    if (key.length === 24) {
      let attribute = attributes?.find((item) => {
        return item._id.toString() === key;
      });
      if (attribute?.variants?.length > 0) {
        let keyVal = variant[key];
        let filterVariant = attribute.variants.find((item) => {
          return item._id.toString() === keyVal;
        });

        if (index === 0) {
          url = `?${encodeURIComponent(
            attribute.name
          )}=${encodeURIComponent(filterVariant?.name)}`;
          nameOfVariant = filterVariant?.name;
        } else {
          url += `&${encodeURIComponent(
            attribute.name
          )}=${encodeURIComponent(filterVariant?.name)}`;
          nameOfVariant += ` ${filterVariant?.name}`;
        }
      }
    }
  });
  return {
    url,
    nameOfVariant: nameOfVariant ?? "",
  };
}

export const productFacet = (
  minPrice = priceRange.min,
  maxPrice = priceRange.max
) => {
  return [
    {
      $facet: {
        hasVariantsTrue: [
          {
            $match: {
              hasVariants: true,
            },
          },
          {
            $unwind: "$variants",
          },

          // { $match: stock === "instock" ? { "variants.stock": { $gt: 0 } } : {} },
          {
            $match: {
              "variants.salePrice": {
                $gte: minPrice,
                $lte: maxPrice,
              },
            },
          },
          //add saleprice to variants.salePrice
          {
            $addFields: {
              price: "$variants.price",
              salePrice: "$variants.salePrice",
            },
          },
        ],
        hasVariantsFalse: [
          {
            $match: {
              hasVariants: false,
            },
          },
          {
            $match: {
              salePrice: {
                $gte: minPrice,
                $lte: maxPrice,
              },
            },
          },
        ],
      },
    },

    {
      $project: {
        totalDocs: {
          $concatArrays: ["$hasVariantsTrue", "$hasVariantsFalse"],
        },
      },
    },
    {
      $unwind: "$totalDocs",
    },
    {
      $replaceRoot: {
        newRoot: "$totalDocs",
      },
    },
  ];
};
