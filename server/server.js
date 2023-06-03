const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const dotenv = require('dotenv');
const jwt = require("jsonwebtoken");

// Load environment variables from .env file
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;
const JWT_SECRET = process.env.JWT_SECRET;

// Create an instance of the Express server
const app = express();

app.use(
  cors({ 
    origin: [CLIENT_URL],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(function (req, res, next) {
  res.header("Content-Type", "application/json;charset=UTF-8");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.set("view engine", "hbs");
app.set("views", "");

// Connect to your MongoDB Cloud database
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(MONGO_URI)
    console.error('Error connecting to MongoDB:', error);
  });

// Define the book schema
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  year: Number,
  photo: String,
});

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

// Create a book model based on the schema
const Book = mongoose.model('Book', bookSchema);
const Admin = mongoose.model('Admin', adminSchema);

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Handle the POST request to add a book
app.post('/add-book', upload.single('photo'), async (req, res) => {
  console.log(req.body)
  try {
    // Create a new book object with the received data
    const newBook = new Book({
      title: req.body.title,
      author: req.body.author,
      year: req.body.year,
      photo: req.file.filename,
    });

    // Save the book to the database
    await newBook.save();
    console.log('Book added to database');
    res.sendStatus(200);
  } catch (error) {
    console.error('Error adding book:', error);
    res.sendStatus(500);
  }
});

app.post('/adminlogin',urlencodedParser,async (req, res) => {
  // console.log(req.body)
  try {
    const { email, password } = req.body;

    // Check the email and password against the admin credentials in the database
    const admin = await Admin.findOne({ email });
    console.log(admin)

    if (admin && admin.password === password) {
      // Authentication successful
      // Generate a token for the admin
      const token = jwt.sign({ admin }, JWT_SECRET);
      console.log("admin exists")

      // Return the token in the response
      res.status(200).json({ token, admin });
    } else {
      // Authentication failed
      console.log("admin does not exist")
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error authenticating admin:', error);
    res.sendStatus(500);
  }
});



// Start the server

