import mongoose from 'mongoose';

const attributeSchema = new mongoose.Schema(
  {
    name: {
      type: Object,
      required: true,
      unique: true,
    },

    variants: [
      {
        name: {
          type: Object,
          required: true,
        },
        weight: {
          type: Number,
        }, //in kg
      },
    ],
    status: {
      type: String,
      lowercase: true,
      enum: ['show', 'hide'],
      default: 'show',
    },
  },
  {
    timestamps: true,
  },
);

const Attribute =
  mongoose.models.Attribute || mongoose.model('Attribute', attributeSchema);

export default Attribute;
