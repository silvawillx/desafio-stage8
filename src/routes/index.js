const { Router } = require("express");
const usersRoutes = require("../routes/users.routes");
const notesRoutes = require("../routes/notes.routes");
const tagsRoutes = require("../routes/tags.routes");

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/notes", notesRoutes);
routes.use("/tags", tagsRoutes);

module.exports = routes;