import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: Object,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    shortDescription: {
      type: Object,
      required: false,
    },
    useYoutube: {
      type: Boolean,
      default: false,
    },
    youtubeLink: {
      type: String,
      required: false,
    },
    description: {
      type: Object,
      required: false,
    },
    faq: {
      type: Array,
      required: false,
      default: [],
    },
    totalPurchased: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: 'inStock',
      enum: ['upcoming', 'inStock', 'outOfStock'],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    //..........Category..........
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    leafCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    //..........Images.........
    images: {
      type: Array,
      required: false,
    },
    price: {
      type: Number,
    },
    salePrice: {
      type: Number,
    },
    isHomeDeliveryFree: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: Number,
      required: false,
    },
    specifications: [{}],
    //........Variants........
    hasVariants: {
      type: Boolean,
      required: true,
    },
    variantsAttributes: {
      type: Object,
      required: false,
      default: {},
    },
    variants: [{}],
    imageVariant: {
      type: {
        type: String,
        enum: ['same', 'different'],
        default: 'same',
      },
      variantId: {
        type: String,
        required: false,
      },
    },
  },
  {
    timestamps: true,
  },
);

// productSchema.index({ slug: 1 });

// module.exports = productSchema;

const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
