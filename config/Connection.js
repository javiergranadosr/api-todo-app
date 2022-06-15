const mongoose = require("mongoose");

const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to Mongoose");
  } catch (error) {
    console.log(error);
    throw new Error("Error al conectar a la base de datos.");
  }
};

module.exports = {
  connection,
};
