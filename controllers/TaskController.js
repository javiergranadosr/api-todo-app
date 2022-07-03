const { response } = require("express");
const Task = require("../models/TaskModel");

/**
 * Obtener listado de tareas
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getTasks = async (req, res = response) => {
  try {
    const { userId, complete, limit = 5, from = 0 } = req.query;
    let conditions = {};

    if (+complete === 1) {
      conditions = {
        complete: true,
        status: true,
        $and: [{ userId }],
      };
    } else if (+complete === 0) {
      conditions = {
        complete: false,
        status: true,
        $and: [{ userId }],
      };
    } else {
      conditions = { status: true, $and: [{ userId }] };
    }

    const [total, tasks] = await Promise.all([
      Task.countDocuments(conditions),
      Task.find(conditions)
        .skip(+from)
        .limit(+limit)
        .populate("userId", "name"),
    ]);

    return res.json({ code: 200, total, tasks });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Hubo un error al obtener las tareas. Favor de contactar a un administrador.",
    });
  }
};

/**
 * Crear una tarea
 * @param {*} req
 * @param {*} res
 */
const create = async (req, res = response) => {
  try {
    const { name, userId, complete } = req.body;
    const task = new Task({ name, userId, complete });

    await task.save();

    res.status(201).json({
      code: 201,
      message: "Tarea creada con éxito.",
      task,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Hubo un error al crear la tarea. Favor de contactar a un administrador.",
    });
  }
};

/**
 * Elimina una tarea
 * @param {*} req
 * @param {*} res
 */
const deleteTask = async (req, res = response) => {
  try {
    const id = req.params.id;
    const task = await Task.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    );
    res.json({ code: 200, message: `Tarea ${task.name} eliminada con éxito` });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Hubo un error al eliminar la tarea. Favor de contactar a un administrador.",
    });
  }
};

/**
 * Limpia tareas acompletadas
 * @param {*} req
 * @param {*} res
 */
const clearComplete = async (req, res = response) => {
  try {
    const id = req.params.id;
    const tasks = await Task.find({
      complete: true,
      status: true,
      $and: [{ userId: id }],
    });
    let message = "No hay tareas acompletadas.";
    
    if (tasks.length > 0) {
      tasks.map(async (task) => {
        await Task.findByIdAndUpdate(task._id, { status: false });
      });
      message = "Tareas eliminadas con éxito.";
    }

    res.json({ code: 200, message });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Hubo un error al eliminar las tareas. Favor de contactar a un administrador.",
    });
  }
};

/**
 * Actializa el estado de la tarea, en acompletada o activa
 * @param {*} req 
 * @param {*} res 
 */
const changeComplete =  async (req, res = response) => {
  try {
    const { id, complete } = req.body;
    const task = await Task.findByIdAndUpdate(id, {complete}, { new: true });
    res.json({ code: 200, message:`La tarea ${task.name} ha sido actualizada con éxito.`, });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Hubo un error al actualizar la tarea. Favor de contactar a un administrador.",
    });
  }
};

module.exports = {
  getTasks,
  create,
  deleteTask,
  clearComplete,
  changeComplete,
};
