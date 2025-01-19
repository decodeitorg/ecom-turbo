export function populateVariantsAttributes() {
  return [
    {
      // Lookup stage to join with the 'attributes' collection
      $lookup: {
        from: 'attributes',
        // Define variables to be used in the pipeline
        let: {
          // Check if variantsAttributes is an array or object, and handle accordingly
          variantKeys: {
            $cond: {
              if: { $isArray: '$variantsAttributes' },
              then: '$variantsAttributes',
              else: {
                $objectToArray: { $ifNull: ['$variantsAttributes', {}] },
              },
            },
          },
        },
        pipeline: [
          {
            // Match attributes whose _id is in the variantKeys
            $match: {
              $expr: {
                $in: [
                  '$_id',
                  {
                    // Convert each key in variantKeys to ObjectId for comparison
                    $map: {
                      input: '$$variantKeys',
                      as: 'key',
                      in: {
                        $cond: {
                          if: { $eq: [{ $type: '$$key' }, 'object'] },
                          then: { $toObjectId: '$$key.k' },
                          else: { $toObjectId: '$$key' },
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
          {
            // Project only the needed fields and filter variants
            $project: {
              name: 1,
              variants: {
                // Filter variants to include only those in variantsAttributes
                $filter: {
                  input: '$variants',
                  as: 'variant',
                  cond: {
                    $in: [
                      { $toString: '$$variant._id' },
                      {
                        // Find the matching key-value pair in variantKeys
                        $let: {
                          vars: {
                            matchedKey: {
                              $arrayElemAt: [
                                {
                                  $filter: {
                                    input: '$$variantKeys',
                                    as: 'key',
                                    cond: {
                                      $cond: {
                                        if: {
                                          $eq: [{ $type: '$$key' }, 'object'],
                                        },
                                        then: {
                                          $eq: [
                                            '$$key.k',
                                            { $toString: '$_id' },
                                          ],
                                        },
                                        else: {
                                          $eq: ['$$key', { $toString: '$_id' }],
                                        },
                                      },
                                    },
                                  },
                                },
                                0,
                              ],
                            },
                          },
                          // Use the values from the matched key
                          in: {
                            $cond: {
                              if: {
                                $eq: [{ $type: '$$matchedKey' }, 'object'],
                              },
                              then: '$$matchedKey.v',
                              else: '$$matchedKey',
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        ],
        as: 'attributeDetails',
      },
    },
    {
      // Add the processed variantsAttributes field to the document
      $addFields: {
        variantsAttributes: {
          // Map over the joined attributeDetails to create the final structure
          $map: {
            input: '$attributeDetails',
            as: 'attr',
            in: {
              _id: { $toString: '$$attr._id' },
              attributeName: '$$attr.name',
              variants: '$$attr.variants',
            },
          },
        },
      },
    },
  ];
}
