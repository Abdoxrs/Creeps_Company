import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

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
}, {
  timestamps: true
})

userSchema.pre("save", async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  this.passwordConfirmation = undefined;
  
  next();
})

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// ✅ Add method to change password safely
userSchema.methods.changePassword = async function(newPassword, newPasswordConfirmation) {
  this.password = newPassword;
  this.passwordConfirmation = newPasswordConfirmation;
  await this.save();
};

export default mongoose.model("User", userSchema);