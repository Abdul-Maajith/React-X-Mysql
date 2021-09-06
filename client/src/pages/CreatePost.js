import React, { useContext, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage} from "formik"
import * as Yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function CreatePost() {
  let history = useHistory();
  
  const { authState } = useContext(AuthContext);
  
  const initialValues = {
    title: "",
    postText: "",
  };
  
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
  }, []) 
  
  const validationSchema = Yup.object().shape({
    title: Yup.string().required(),
    postText: Yup.string().required(),
  });
  
  // Here, we are accessing username from the token(as we are already logged in via our username!)

  const onSubmit = (data) => {
     axios.post("http://localhost:3001/posts", data, {
       headers: {
         accessToken: localStorage.getItem("accessToken")
       }
     }).then((resp) => {
       history.push("/")
     });
  }
  
  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form>
          <label>Title:</label>
          <ErrorMessage className="error" name="title" component="span" />
          <Field
            id="inputTitle"
            name="title"
            placeholder="(Ex. Title...)"
            autoComplete="off"
          />
          <label>Post:</label>
          <ErrorMessage className="error" name="postText" component="span" />
          <Field
            id="inputPost"
            name="postText"
            placeholder="(Ex. Post...)"
            autoComplete="off"
          />
        
          <button type={"submit"} className="btn">
            Create a Post
          </button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost
