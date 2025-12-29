import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    select: false,
    validate: function (value){
      return value === this.passwordConfirmantion
    }
  },
  passwordConfirmantion: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
},{timestamps: true}
)

userSchema.pre("save",async function () {
  if (this.isNew) {
    this.passwordConfirmation = undefined;
    this.password = await bcrypt.hash(this.password, 10);
  }
})

export default mongoose.model("user",userSchema);