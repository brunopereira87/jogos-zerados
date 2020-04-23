const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const Schema = mongoose.Schema;
const userSchema = Schema({
  name: {
    type: String,
    required: [true, "Por favor, digite o nome"]
  },
  email: {
    type: String,
    required: [true, "Por favor, digite o email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Por favor, digite um email válido"]
  },
  password: {
    type: String,
    required: [true, "Por favor, digite a senha"],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, "Por favor, digite a senha"],
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: "As duas senhas devem ser iguais"
    }
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  games: [
    {
      type: Schema.ObjectId,
      ref: "games"
    }
  ]
});

//CUSTOM METHODS
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

//SAVE MIDDLEWARES
userSchema.pre("save", function(next) {
  if (!this.isModified("password") || !this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

//QUERY MIDDLEWARES
userSchema.pre(/^find/, function(next) {
  this.populate({
    path: "games",
    select: "name plataform slug artbox"
  });

  next();
});
module.exports = mongoose.model("users", userSchema);
