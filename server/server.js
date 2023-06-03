const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT;

// Create an instance of the Express server
const app = express();

// Connect to your MongoDB Cloud database
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
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

app.post('/adminlogin', async (req, res) => {
  console.log(req.body)
  try {
    const { email, password } = req.body;

    // Check the email and password against the admin credentials in the database
    const admin = await Admin.findOne({ email });

    if (admin && admin.password === password) {
      // Authentication successful
      // Generate a token for the admin
      const token = generateAdminToken();
      console.log(admin)

      // Return the token in the response
      res.status(200).json({ token, adminName: admin.name });
    } else {
      // Authentication failed
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error authenticating admin:', error);
    res.sendStatus(500);
  }
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
