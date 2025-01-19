import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
      default:
        'https://t4.ftcdn.net/jpg/05/42/36/11/360_F_542361185_VFRJWpR2FH5OiAEVveWO7oZnfSccZfD3.jpg',
    },
    address: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      number: {
        type: String,
        required: false,
        default: '',
      },
      verified: {
        type: Boolean,
        required: false,
      },
      otp: {
        type: String,
        required: false,
      },
    },
    password: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: true,
      default: 'Customer',
      enum: ['Customer', 'Admin', 'SuperAdmin'],
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  },
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
