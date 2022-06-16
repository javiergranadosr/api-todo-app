const { response } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/UserModel");

/**
 * Crea un nuevo usuario
 * @param {*} req
 * @param {*} res
 */
const create = async (req, res = response) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });

    const hashPassword = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, hashPassword);

    await user.save();

    res.status(201).json({
      code: 201,
      message: "Cuenta creada con éxito.",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Hubo un error al crear la cuenta de usuario. Favor de contactar a un administrador.",
    });
  }
};

/**
 * Actualizar cuenta de usuario
 * @param {*} req
 * @param {*} res
 */
const update = async (req, res = response) => {
  try {
    const id = req.params.id;
    const { name, email, password } = req.body;
    let data = { name };

    if (email) {
      const user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          message: `El usuario con el correo ${email} ya se encuentra registrado. `,
        });
      }
      data.email = email;
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          message:
            "La contraseña es obligatoria y debe tener un mínimo de 6 caracteres.",
        });
      }
      const hashPassword = bcryptjs.genSaltSync();
      const newPassword = bcryptjs.hashSync(password, hashPassword);
      data.password = newPassword;
    }

    const user = await User.findByIdAndUpdate(id, data, { new: true });

    res.json({
      code: 200,
      message: "Cuenta actualizada con éxito.",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Hubo un error al actualizar la cuenta de usuario. Favor de contactar a un administrador",
    });
  }
};

/**
 * Eliminar cuenta de usuario
 * @param {*} req
 * @param {*} res
 */
const deleteUser = async (req, res = response) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    );

    res.json({
      code: 200,
      message: "Cuenta eliminada con éxito.",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Hubo un error al dar de baja la cuenta de usuario. Favor de contactar a un administrador",
    });
  }
};

module.exports = {
  create,
  update,
  deleteUser,
};
