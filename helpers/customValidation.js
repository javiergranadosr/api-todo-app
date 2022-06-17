const User = require("../models/UserModel");
const Task = require("../models/TaskModel");

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
    throw new Error(`El usuario con el id ${id} no es valido.`);
  }
};

const existTaskById = async (id) => {
  const task = await Task.findById(id);
  if (!task) {
    throw new Error(`La tarea con el id ${id} no es valido.`);
  }
};

module.exports = { existUserByEmail, existUserById, existTaskById };
