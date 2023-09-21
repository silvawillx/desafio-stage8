const knex = require("../database/knex");
const AppError = require("../utils/appError");
class NotesController {
  async create(request, response) {
    const { title, description, rating, tags } = request.body;
    const { user_id } = request.params;

    const [note_id] = await knex("notes").insert({
      title,
      description,
      rating,
      user_id,
    });

    const tagsInsert = tags.map((name) => {
      return {
        note_id,
        user_id,
        name,
      };
    });

    await knex("tags").insert(tagsInsert);

    return response.json({
      message: "note created",
    });
  }

  async show(request, response) {
    const { id } = request.params;

    const note = await knex("notes").where({ id }).first();
    if (!note) {
      throw new AppError("note not found");
    }

    const tags = await knex("tags").where({ note_id: id }).orderBy("name");
    return response.json({
      ...note,
      tags,
    });
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("notes").where({ id }).delete();

    return response.json({
      message: "note deleted",
    });
  }

  async index(request, response) {
    const { user_id, title, tags } = request.query;

    let notes;

    if (tags) {
      const filterTags = tags.split(",").map((tag) => tag.trim());

      notes = await knex("tags")
        .select(["notes.id", "notes.title", "notes.user_id"])
        .where("notes.user_id", user_id)
        .whereLike("notes.title", `%${title}%`)
        .whereIn("name", filterTags)
        .innerJoin("notes", "notes.id", "tags.note_id")
        .orderBy("notes.title");
    } else {
      notes = await knex("notes")
        .whereLike("title", `%${title}%`)
        .where({ user_id })
        .orderBy("title");
    }

    const allTags = await knex("tags").where({ user_id });

    const notesWithTags = notes.map((note) => {
      const filterTags = allTags.filter((tag) => tag.note_id === note.id);

      return {
        ...note,
        tags: filterTags,
      };
    });

    return response.json(notesWithTags);
  }
}

module.exports = NotesController;