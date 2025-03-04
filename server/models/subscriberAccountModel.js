import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const subscriberAccountSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    userGuid: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

subscriberAccountSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

subscriberAccountSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const SubscriberAccount = mongoose.model("SubscriberAccount", subscriberAccountSchema);
export default SubscriberAccount;
