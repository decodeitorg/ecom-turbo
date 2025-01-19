import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: Object,
      required: true,
      unique: true,
      index: true,
    },

    description: {
      type: Object,
      required: false,
    },
    parentId: {
      type: String,
      required: false,
    },
    parentName: {
      type: String,
      required: false,
    },
    icon: {
      type: String,
      required: false,
    },
    youtubeLink: {
      type: String,
      required: false,
    },
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

categorySchema.index({ name: 'text' });

// module.exports = categorySchema;

const Category =
  mongoose.models.Category || mongoose.model('Category', categorySchema);
export default Category;
