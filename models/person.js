/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
require('dotenv').config();
const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);
mongoose.connect(url).then(
  // eslint-disable-next-line no-unused-vars
  (result) => console.log('Connected to MongoDB'),
).catch(
  (error) => console.log('error connecting to MongoDB ', error.message),
);

const personSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: (v) => {
        if (v.length < 8) return false;
        return /\d{2,3}-\d+/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: true,
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
