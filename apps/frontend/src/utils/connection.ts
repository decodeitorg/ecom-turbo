import mongoose from 'mongoose';

const connect = async () => {
  try {
    if (!mongoose.connection.readyState) {
      mongoose
        .connect(import.meta.env.DB_CONNECTION_STRING, {
          autoIndex: false,
        })
        .then(() => {
          console.log('Database connected');
        })
        .catch((error) => {
          console.log('🚀 ~ connect ~ error:', error.message);
          return error;
        });
    }
  } catch (error) {
    console.log('🚀 ~ connect ~ error:', error.message);
    return error;
  }
};

export default connect;
