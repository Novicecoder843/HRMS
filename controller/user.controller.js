const userService = require("../services/user.service");

class UserController {
  async create(req, res) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async getAll(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) return res.status(404).json({ message: "Not found" });

      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await userService.deleteUser(req.params.id);
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new UserController();
