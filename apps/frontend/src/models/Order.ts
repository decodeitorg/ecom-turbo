import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: String,
    },
    userName: {
      type: String,
      required: true,
    },
    userImage: {
      type: String,
      required: false,
    },
    userEmail: {
      type: String,
      required: false,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    fraudStatus: {
      type: Object,
      required: false,
      default: {},
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    note: {
      type: String,
    },
    paymentMethod: {
      type: String,
      enum: ['cashOnDelivery', 'onlinePayment'],
      required: true,
    },

    isPaymentEnabled: {
      type: Boolean,
      required: true,
    },
    isHomeDeliverySelected: {
      type: Boolean,
      required: true,
      default: true,
    },
    isHomeDeliveryFree: {
      type: Boolean,
      required: true,
    },
    takeShippingFeeAdvance: {
      type: Boolean,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    shippingCost: {
      type: Number,
      required: true,
    },
    inTotal: {
      type: Number,
      required: true,
    },
    totalExtraDeliveryCharge: {
      type: Number,
    },
    shippingFeeAdvanceForCashOnDelivery: {
      type: Number,
    },
    totalPayableWhileDelivery: {
      type: Number,
      required: true,
    },

    cartItems: [
      {
        _id: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        slug: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        salePrice: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        hasVariant: {
          type: Boolean,
          required: true,
        },
        variant: {
          type: Object,
          required: false,
        },
        variant_id: {
          type: String,
          required: false,
        },
        nameOfVariant: {
          type: String,
          required: false,
        },
      },
    ],
    //...........SSL Payment.............
    status: {
      type: String,
      enum: ['pending', 'processing', 'onDelivery', 'delivered', 'cancelled'],
      default: 'pending',
    },
    refundStatus: {
      type: String,
      enum: ['processing', 'failed', 'success', ''],
      default: '',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
    },
    ssl: {
      bank_tran_id: String,
      refund_ref_id: String,
    },
    //...........Steadfast.............
    steadFast: {
      consignment_id: {
        type: String,
        required: false,
        default: '',
      },
      tracking_code: {
        type: String,
        required: false,
        default: '',
      },
      status: {
        type: String,
        required: false,
        default: '',
      },
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
