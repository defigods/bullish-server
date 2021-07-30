const mongo = require('./config/mongo');
const app = require('./config/express');

mongo.connect();

app.listen(process.env.PORT, () =>
  console.log('Server listening on port ' + process.env.PORT),
);
