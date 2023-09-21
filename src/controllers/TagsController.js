const knex = require("../database/knex");

class TagsController {
  async index(request, response) {
    const { user_id } = request.params;

    const allTags = await knex("tags").where({ user_id });

    return response.json(allTags);
  }
}
module.exports = TagsController;