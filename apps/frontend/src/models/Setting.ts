import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    perKgFee: {
      type: Number,
      default: 0,
    },

    takeShippingFeeAdvance: {
      type: Boolean,
      default: false,
    },

    shippingLocationFee: {
      type: [
        {
          location: {
            type: String,
            required: true, // Add required if necessary
          },
          fee: {
            type: Number,
            required: true, // Add required if necessary
            min: 0, // Add validation to ensure fee is a positive number
          },
        },
      ],
      default: [],
    },
    sslCommerz: {
      isSslCommerzEnabled: {
        type: Boolean,
        default: false,
      },
      storeId: {
        type: String,
        default: '',
      },
      storePassword: {
        type: String,
        default: '',
      },
      isLive: {
        type: Boolean,
        default: false,
      },
    },
    steadFast: {
      isSteadfastEnabled: {
        type: Boolean,
        default: false,
      },
      apiKey: {
        type: String,
        default: '',
      },
      secretKey: {
        type: String,
        default: '',
      },
    },
    facebookPixel: {
      pixelId: {
        type: String,
        default: '',
      },
      accessToken: {
        type: String,
        default: '',
      },
      test_event_code: {
        type: String,
        default: '',
      },
    },
    timeZone: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

// module.exports = settingSchema;

const Setting =
  mongoose.models.Setting || mongoose.model('Setting', settingSchema);

export default Setting;
