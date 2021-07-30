const mongoose = require('mongoose');

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error --->', err);
  process.exit(-1);
});

module.exports = {
  connect: () => {
    mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      keepAlive: 1,
    });
    return mongoose.connection;
  },
};
