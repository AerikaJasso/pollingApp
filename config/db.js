const mongoose = require('mongoose');

// Map global promises
mongoose.Promise = global.Promise;
// Mongoose connect
mongoose.connect('mongodb://aj:passthis@ds121588.mlab.com:21588/pusherpoll')
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));