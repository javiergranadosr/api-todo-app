const { response } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/UserModel");
const { generateJwt } = require("../helpers/generateJWT");

/**
 * Inicio de sesion de usuarios
 * @param {*} req
 * @param {*} res
 * @returns
 */
const login = async (req, res = response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        code: 400,
        message: "Usuario / Contraseña  incorrectos.",
      });
    }

    if (!user.status) {
      return res.status(400).json({ code: 400, message: "Usuario dado de baja." });
    }

    const validatePassword = bcryptjs.compareSync(password, user.password);
    if (!validatePassword) {
      return res
        .status(400)
        .json({code: 400, message: "Usuario / Contraseña  incorrectos." });
    }

    const token = await generateJwt(user.id);

    res.json({ user, token  });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Hubo un error al iniciar sesion. Favor de contactar a un administrador",
    });
  }
};

module.exports = { login };
