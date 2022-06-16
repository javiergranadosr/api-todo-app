const express = require("express");
const cors = require("cors");
const { connection } = require("./Connection");

class Server {
  constructor() {
    this.app = express();
    this.port = 8081;

    this.ep = {
      users: "/api/v1/users",
      auth: "/api/v1/auth",
      tasks: "/api/v1/tasks",
    };

    this.connection();
    this.middlewares();
    this.routes();
  }

  async connection() {
    await connection();
  }

  middlewares() {
    // CORS
    this.app.use(cors());
    // LECTURA Y PARSEO EN BODY
    this.app.use(express.json());
  }

  routes() {
    this.app.use(this.ep.users, require("../routers/user"));
    this.app.use(this.ep.auth, require("../routers/auth"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server started on port ${this.port}`);
    });
  }
}

module.exports = Server;
