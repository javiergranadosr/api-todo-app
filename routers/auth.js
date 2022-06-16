const { Router } = require("express");
const { check } = require("express-validator");
const { validate } = require("../middlewares/validate");
const { login } = require("../controllers/AuthController");

router = Router();

router.post(
  "/login",
  [
    check("email", "El correo electrónico es obligatorio.").isEmail(),
    check("password", "La contraseña es obligatoria.").not().isEmpty(),
    validate,
  ],
  login
);

module.exports = router;
