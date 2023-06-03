import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  makeStyles,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme) =>
 ({
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to add book details to the database or perform any other actions

    // Reset form fields
    setTitle('');
    setAuthor('');
    setYear('');
    setPhoto(null);
  };

  return (
    <Container className={classes.container}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          label="Title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          InputProps={{
            className: classes.input,
          }}
        />
        <TextField
          label="Author"
          variant="outlined"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          InputProps={{
            className: classes.input,
          }}
        />
        <TextField
          label="Year"
          variant="outlined"
          value={year}
          onChange={(e) => setYear(e.target.value)}
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
        <label htmlFor="book-photo">
          <Button
            variant="contained"
            color="default"
            component="span"
            className={classes.uploadButton}
          >
            Upload Photo
          </Button>
        </label>
        {photo && (
          <Typography variant="body1" color="textSecondary">
            Selected photo: {photo.name}
          </Typography>
        )}
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
