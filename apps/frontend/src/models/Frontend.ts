import mongoose from 'mongoose';
import { boolean } from 'yup';

const heroCarouselItemSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
  { _id: true },
);

const customerReviewImagesSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
  },
  { _id: true },
);

const campaignImagelItemSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
  { _id: true },
);

const featureBannerSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});

const frontendSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    logo: {
      type: String,
    },
    description: {
      type: String,
    },
    youtube: {
      type: String,
    },
    instagram: {
      type: String,
    },
    facebook: {
      type: String,
    },
    tiktok: {
      type: String,
    },
    email: {
      type: String,
    },
    address: {
      type: [String],
    },
    phoneNumber: {
      type: [String],
    },
    whatsappNumber: {
      type:String
    },

    //Landing page start
    landingPageComponents: [
      {
        id: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        isEnabled: {
          type: Boolean,
          default: true,
        },
        order: {
          type: Number,
          required: true,
        },
      },
    ],

    whyChooseUs: {
      title: {
        type: String,
        default: '',
      },
      points: {
        type: Array,
        default: [
          {
            title: '',
            description: '',
          },
        ],
      },
      image: {
        type: String,
        default: '',
      },
      image2: {
        type: String,
        default: '',
      },
      button: {
        text: {
          type: String,
          default: '',
        },
        link: {
          type: String,
          default: '',
        },
      },
    },

    heroCarousel: {
      type: [heroCarouselItemSchema],
      default: [],
    },
    campaignImages: {
      type: [campaignImagelItemSchema],
      default: [],
    },
    featureBanner: {
      type: featureBannerSchema,
    },
    customerReviewImages: {
      type: [customerReviewImagesSchema],
      default: [],
    },
    brands: {
      type: [
        {
          image: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },
    //Landing page end
    aboutUs: {
      type: String,
    },
    customerService: {
      type: String,
    },
    privacyPolicy: {
      type: String,
    },
    termsAndConditions: {
      type: String,
    },
    pushSubscription: {
      type: [Object],
      required: false,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Frontend =
  mongoose.models.Frontend || mongoose.model('Frontend', frontendSchema);
export default Frontend;
