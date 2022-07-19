const mongoose = require('mongoose');
const userModel = require('../models/User');

class UserController {

    //GET ALL USE
    async getUsers(req, res) {
        try {
            const users = await userModel.find();
            res.status(200).json(users)
        } catch (error) {
            res.status(500).json(error);
        }
    }

    //DELETE USE
    async deleteUser(req, res) {
        console.log("deleting ...")
        try {
            const { id } = req.params;
            await userModel.findByIdAndDelete({ _id: id });
            res.status(200).json("Deleted user")
        } catch (error) {
            res.status(500).json(error)

        }

    }
}


module.exports = new UserController;