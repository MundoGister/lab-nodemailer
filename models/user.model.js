const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const FIRST_ADMIN_EMAIL = process.env.FIRST_ADMIN_EMAIL;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Name is required'
  },
  email: {
    type: String,
    required: 'Email is required',
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    unique: true
  },
  password: {
    type: String,
    required: 'Password is required',
  },
  social: {
    googleId: String,
    facebookId: String
  },
  role: {
    type: String,
    enum: ['ADMIN', 'GUEST'],
    default: 'GUEST'
  },
  confirmationCode: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

function generateRandomString () {
   return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 40);
}

userSchema.pre('save', function(next) {
  if (this.email === FIRST_ADMIN_EMAIL) {
    this.role = 'ADMIN';
  }

  // if (this.isModified('password')) {
    bcrypt.genSalt(SALT_WORK_FACTOR)
      .then(salt => {
        return bcrypt.hash(this.password, salt)
      })
      .then(hash => {
        this.password = hash;
        this.confirmationCode = generateRandomString();
        // next();
      })
      .catch(error => next(error));
  // } else {
    // next();
  // }
});

userSchema.methods.checkPassword = function(password) {
  return bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema);
module.exports = User;
