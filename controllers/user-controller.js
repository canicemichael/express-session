const bcrypt = require("bcrypt");
const User = require("../models/user-models");

const registerPage = (req, res) => {
    res.render("signup");
}

const loginPage = (req, res) => {
    res.render("login");
}

const registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username: username, password: hashedPassword });
    await user.save();
    res.send("Signup successful!");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred during signup");
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).send("Invalid username or password");
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).send("Invalid username or password.");
      return;
    }

    req.session.username = username;
    res.send("Login successful!");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred during login.");
  }
};

const logout = async (req, res) => {
    req.session.destroy((error) => {
        if(error) {
            console.error('Error destroying session: ', error);
        }
        res.redirect('/');
    })
}

module.exports = {registerPage, loginPage, registerUser, loginUser, logout};