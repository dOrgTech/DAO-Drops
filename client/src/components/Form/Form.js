import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Paper } from "@material-ui/core";
import FileBase from "react-file-base64";
import { useDispatch, useSelector } from "react-redux";

import useStyles from "./styles";
import { createPost, updatePost } from "../../actions/posts";

const Form = ({ currentId, setCurrentId }) => {
  const [postData, setPostData] = useState({
    address: "",
    name: "",
    message: "",
    link: "",
    contact: "",
    selectedFile: ""
  });
  const classes = useStyles();
  const dispatch = useDispatch();
  const post = useSelector(state =>
    currentId ? state.posts.find(p => p._id === currentId) : null
  );

  useEffect(() => {
    if (post) setPostData(post);
  }, [post]);

  const handleSubmit = e => {
    e.preventDefault();

    if (currentId) {
      dispatch(updatePost(currentId, postData));
    } else {
      dispatch(createPost(postData));
    }
  };

  const clear = () => {};

  return (
    <Paper className={classes.paper}>
      <form
        autoComplete="off"
        noValidate
        className={classes.form}
        onSubmit={handleSubmit}
      >
        <Typography variant="h6">Nominate A Project</Typography>
        <TextField
          name="name"
          variant="outlined"
          label="Name of the Person/DAO/Project"
          fullWidth
          value={postData.name}
          onChange={e => setPostData({ ...postData, name: e.target.value })}
        />
        <TextField
          name="address"
          variant="outlined"
          label="Their ETH Address"
          fullWidth
          value={postData.address}
          onChange={e => setPostData({ ...postData, address: e.target.value })}
        />
        <TextField
          name="message"
          variant="outlined"
          label="Description"
          fullWidth
          value={postData.message}
          onChange={e => setPostData({ ...postData, message: e.target.value })}
        />
        <TextField
          name="link"
          variant="outlined"
          label="Project Link"
          fullWidth
          value={postData.link}
          onChange={e => setPostData({ ...postData, link: e.target.value })}
        />
        <TextField
          name="contact"
          variant="outlined"
          label="Contact"
          fullWidth
          value={postData.contact}
          onChange={e => setPostData({ ...postData, contact: e.target.value })}
        />
        <div className={classes.fileInput}>
          <FileBase
            type="file"
            multiple={false}
            onDone={({ base64 }) =>
              setPostData({ ...postData, selectedFile: base64 })
            }
          />
        </div>
        <Button
          className={classes.buttonSubmit}
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          fullWidth
        >
          Submit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={clear}
          fullWidth
        >
          Clear
        </Button>
      </form>
    </Paper>
  );
};

export default Form;
