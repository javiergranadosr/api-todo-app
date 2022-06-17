const { Schema, model } = require("mongoose");

const TaskSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre de la actividad es obligatorio."],
    },
    complete: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // TODO: createdAt, updatedAt
    versionKey: false,
  }
);

TaskSchema.methods.toJSON = function () {
  const { __v, _id, ...tasks } = this.toObject();
  tasks.uid = _id;
  return tasks;
};

module.exports = model("Task", TaskSchema);
