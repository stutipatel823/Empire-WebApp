const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return  jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.login(email, password);
    // create a token
    const token = createToken(user._id);
    res.status(200).json({email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup user
const signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await UserModel.signup(name, email, password);
    // create a token
    const token = createToken(user._id);
    res.status(200).json({ _id: user._id, email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get all users
const getUsers = async (req, res) => {
  const users = await UserModel.find({}).sort({ createdAt: -1 });
  res.status(200).json(users);
};

// get a single user
const getUser = async (req, res) => {
  const { id } = req.params; //grab id from params (url)
  try {
    const user = await UserModel.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// create a new user
const createUser = async (req, res) => {
  try {
    const user = await UserModel.create(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  const deletedUser = await UserModel.findByIdAndDelete(id); // This deletes the user
  if (!deletedUser) {
    // alternate of try-catch
    return res.status(404).json({ error: "User not found" });
  }
  res.status(200).json({ message: "ITEM DELETED!", user: deletedUser });
};

// update a user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findByIdAndUpdate({ _id: id }, { ...req.body });
  if (!user) {
    res.status(400).json({ error: "User not found" });
  }
  res.status(200).json(user);
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
  loginUser,
  signupUser,
};
