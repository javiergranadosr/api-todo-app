const { response } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
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

    res.json({code: 200, user, token  });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Hubo un error al iniciar sesion. Favor de contactar a un administrador",
    });
  }
};

/**
 * Verifica token de usuario
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const validateToken =  async (req, res = response) => {
  try {
    const token = req.header("x-token");

    if (!token) {
      return res
        .status(401)
        .json({ code: 401, message: "No se encontró token en la petición.", ok: false });
    }

    const { uid } = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(uid);

    if (!user) {
      return res
        .status(401)
        .json({ code: 401, message: "Usuario / password incorrectos.", ok: false });
    }

    if (!user.status) {
      return res
        .status(401)
        .json({ code: 401, message: "Usuario inactivo.", ok: false });
    }

   
    res.json({ code: 200, token, ok: true, user })

  } catch (error) {
    console.log(error);
    return res.status(500).json({code: 500, message: "Token invalido.", ok: false});
  }
}

module.exports = { login, validateToken };
