import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  makeStyles,
  Typography,
} from '@material-ui/core';
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: '#141B2D',
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    '& > *': {
      margin: theme.spacing(1),
      width: '300px',
    },
  },
  input: {
    color: '#FFF',
  },
  uploadButton: {
    marginTop: theme.spacing(1),
    backgroundColor: '#58B8BB',
    color: '#FFF',
  },
  addButton: {
    backgroundColor: '#58B8BB',
    color: '#FFF',
  },
}));

const AddBookForm = () => {
  const classes = useStyles();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [photo, setPhoto] = useState(null);

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('year', year);
    formData.append('photo', photo);
  
    try {
      const response = await fetch(`${SERVER_URL}/add-book`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
  
      if (response.ok) {
        // Handle successful response
        console.log('Book added successfully');
        // Reset form fields
        setTitle('');
        setAuthor('');
        setYear('');
        setPhoto(null);
      } else {
        // Handle error response
        console.log('Error adding book');
      }
    } catch (error) {
      // Handle fetch error
      console.log('Error:', error);
    }
  };
  

  return (
    <Container className={classes.container}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          label="Title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          InputLabelProps={{
            style: { color: 'white' },
          }}
          InputProps={{
            className: classes.input,
          }}
        />
        <TextField
          label="Author"
          variant="outlined"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          InputLabelProps={{
            style: { color: 'white' },
          }}
          InputProps={{
            className: classes.input,
          }}
        />
        <TextField
          label="Year"
          variant="outlined"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          InputLabelProps={{
            style: { color: 'white' },
          }}
          InputProps={{
            className: classes.input,
          }}
        />
        <input
          accept="image/*"
          className={classes.input}
          id="book-photo"
          type="file"
          onChange={handlePhotoChange}
        />
        {/* {photo && (
          <Typography variant="body1" color="textSecondary" style={{ color: "white" }}>
            Selected photo: {photo.name}
          </Typography>
        )} */}
        <Button
          variant="contained"
          color="primary"
          type="submit"
          className={classes.addButton}
        >
          Add Book
        </Button>
      </form>
    </Container>
  );
};

export default AddBookForm;
