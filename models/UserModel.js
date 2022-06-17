const { Schema, model } = require("mongoose");

const UserSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Nombre de usuario es requerido."],
    },
    email: {
      type: String,
      required: [true, "Email de usuario es requerido."],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password de usuario es requerido."],
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // TODO: createdAt, updatedAt
    versionKey: false,
  }
);

UserSchema.methods.toJSON = function () {
  const { __v, password, _id, ...users } = this.toObject();
  users.uid = _id;
  return users;
};

module.exports = model("User", UserSchema);
