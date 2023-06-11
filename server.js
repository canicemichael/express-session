require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const MongoDBStore = require("connect-mongodb-session")(session);
const path = require("path");
const userRoutes = require("./routes/user-routes");

const app = express();

const store = new MongoDBStore({
  uri: process.env.URI,
  collection: "sessions",
});

store.on("error", (error) => {
  console.error("Session store error: ", error);
});

mongoose.connect(process.env.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middlewares for parsing cookies and sessions
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 3600000, // Session expiry time (in milliseconds)
    },
    rolling: true, // Update the session expiry on each request
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  if (req.session.username) {
    res.send(`Welcome, ${req.session.username}!`);
  } else {
    res.render("home");
  }
});

app.use(userRoutes);

app.get("/private", (req, res) => {
  if (req.session.username){
    res.render("private");
  } else {
    res.redirect('/');
  }
});

// app.post("/signup", async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ username: username, password: hashedPassword });
//     await user.save();
//     res.send("Signup successful!");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("An error occurred during signup");
//   }
// });

// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await User.findOne({ username });
//     if (!user) {
//       res.status(401).send("Invalid username or password");
//       return;
//     }

//     const passwordMatch = await bcrypt.compare(password, user.password);
//     if (!passwordMatch) {
//       res.status(401).send("Invalid username or password.");
//       return;
//     }

//     req.session.username = username;
//     res.send("Login successful!");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("An error occurred during login.");
//   }
// });

// Start the server
app.listen(3000, () => {
  console.log(`Server started on port 3000`);
});
