import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    select: false,
    minlength: [8, 'Password must be at least 8 characters'],
    validate: {
      validator: function (value) {
        return value === this.passwordConfirmation;
      },
      message: 'Passwords do not match'
    }
  },
  passwordConfirmation: {
    type: String,
    required: [true, 'Please confirm your password'],
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  passwordChangedAt: {
    type: Date
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  active: {
    type: Boolean,
    default: true,
    select: false
  }
}, {
  timestamps: true
});


userSchema.pre("save", async function () {
  if (!this.isModified('password')) {
    return;
  }

  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  this.passwordConfirmation = undefined;

  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
  }
});


userSchema.pre(/^find/,async function() {
  this.find({ active: { $ne: false } });
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.changePassword = async function(newPassword, newPasswordConfirmation) {
  this.password = newPassword;
  this.passwordConfirmation = newPasswordConfirmation;
  await this.save();
};


userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};


userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

export default mongoose.model("User", userSchema);