const { Router } = require("express");
const tagsRoutes = Router();

const TagsController = require("../controller/tagsController");

const tagsController = new TagsController();

tagsRoutes.get("/:user_id", tagsController.index);

module.exports = tagsRoutes;