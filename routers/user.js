const { Router } = require("express");
const { check } = require("express-validator");
const { validate } = require("../middlewares/validate");
const { existUserByEmail, existUserById } = require("../helpers/customValidation");
const { create, update, deleteUser } = require("../controllers/UserController");

const router = Router();

router.post(
  "/",
  [
    check("name", "El nombre de usuario es obligatorio.").not().isEmpty(),
    check("email", "El correo electrónico es obligatorio.").isEmail(),
    check("email").custom(existUserByEmail),
    check(
      "password",
      "La contraseña es obligatoria y debe tener un mínimo de 6 caracteres."
    ).isLength({ min: 6 }),
    validate,
  ],
  create
);

router.put(
  "/:id",
  [
    check("id", "No es un id valido.").isMongoId(),
    check("id").custom(existUserById),
    check("name", "El nombre de usuario es obligatorio.").not().isEmpty(),
    validate,
  ],
  update
);

router.delete(
    "/:id",
    [
      check("id", "No es un id valido.").isMongoId(),
      check("id").custom(existUserById),
      validate,
    ],
    deleteUser
  );

module.exports = router;
