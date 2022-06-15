const User = require("../models/UserModel");

const existUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  if (user) {
    throw new Error(
      `El usuario con el correo ${email} ya se encuentra registrado. `
    );
  }
};

const existUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error(
      `El usuario con el id ${id} no es valido.`
    );
  }
};

module.exports = { existUserByEmail, existUserById };
