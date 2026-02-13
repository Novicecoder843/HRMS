const User = require("../models/user.model");
const bcrypt = require("bcrypt");

class UserService {
  async createUser(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return await User.create({
      ...data,
      password_hash: hashedPassword,
    });
  }

  async getAllUsers() {
    return await User.findAll();
  }

  async getUserById(id) {
    return await User.findById(id);
  }

  async updateUser(id, data) {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");

    return await user.update(data);
  }

  async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");

    return await user.destroy();
  }
}

module.exports = new UserService();
