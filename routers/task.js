const { Router } = require("express");
const { check } = require("express-validator");
const { validate } = require("../middlewares/validate");
const {
  getTasks,
  create,
  deleteTask,
  clearComplete,
  changeComplete,
} = require("../controllers/TaskController");
const { validateJwt } = require("../middlewares/validateJWT");
const { existUserById, existTaskById } = require("../helpers/customValidation");

router = Router();

router.get(
  "/",
  [
    validateJwt,
    check("userId", "No es un id valido del usuario.").isMongoId(),
    check("userId").custom(existUserById),
    validate,
  ],
  getTasks
);
router.post(
  "/",
  [
    validateJwt,
    check("name", "El nombre de la tarea es obligatorio.").not().isEmpty(),
    check("userId", "No es un id valido").isMongoId(),
    check("userId").custom(existUserById),
    validate,
  ],
  create
);

router.put(
  "/:id",
  [
    validateJwt,
    check("id", "No es un id valido del usuario.").isMongoId(),
    check("id").custom(existUserById),
    validate
  ],
  clearComplete
);

router.delete(
  "/:id",
  [
    validateJwt,
    check("id", "No es un id valido de la tarea").isMongoId(),
    check("id").custom(existTaskById),
    validate,
  ],
  deleteTask
);

router.post(
  "/changeComplete",
  [
    validateJwt,
    check("id", "No es un id valido de la tarea").isMongoId(),
    check("id").custom(existTaskById),
    check("complete", "El estatus no debe estar vacio").not().isEmpty(),
    validate
  ],
  changeComplete
);

module.exports = router;
