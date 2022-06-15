const { response } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const validateJwt = async (req, res = response, next) => {
  try {
    const token = req.header("x-token");

    if (!token) {
      return res
        .status(401)
        .json({ message: "No se encontró token en la petición." });
    }

    const { uid } = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(uid);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Usuario / password incorrectos." });
    }

    if (!user.status) {
      return res
        .status(401)
        .json({ message: "Usuario inactivo." });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Token invalido." });
  }
};

module.exports = { validateJwt };
