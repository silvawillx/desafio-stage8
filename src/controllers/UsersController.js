const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/appError");
const knex = require("../database/knex");
class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    const checkEmail = await knex("users").where({ email }).first();

    if (checkEmail) {
      throw new AppError("Email already Exists");
    }

    const hashedPassword = await hash(password, 8);

    await knex("users").insert({
      name,
      email,
      password: hashedPassword,
    });

    return response.status(201).json({
      message: "User Created",
    });
  }
  async update(request, response) {
    const { name, email, current_password, new_password } = request.body;
    const { id } = request.params;

    const user = await knex("users").where({ id }).first();

    if (!user) {
      throw new AppError("User not found");
    }

    const checkEmail = await knex("users").where({ email }).first();
    if (checkEmail && checkEmail.id !== user.id) {
      throw new AppError("Email already exists");
    }

    user.name = name;
    user.email = email;

    if (current_password && !new_password) {
      throw new AppError("info the new password");
    }
    if (!current_password && new_password) {
      throw new AppError("info the current password");
    }
    if (current_password && new_password) {
      const checkCurrentPassword = await compare(
        current_password,
        user.password
      );

      if (!checkCurrentPassword) {
        throw new AppError("incorrect current password");
      }

      user.password = await hash(new_password, 8);
    }

    await knex("users").where({ id }).update({
      name: user.name,
      email: user.email,
      password: user.password,
      updated_at: knex.fn.now(),
    });

    return response.json({
      message: "user updated",
    });
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("users").where({ id }).delete();

    return response.json({
      message: "user deleted",
    });
  }
}

module.exports = UsersController;