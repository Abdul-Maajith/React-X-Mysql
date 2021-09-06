import React from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";

function Registration() {
    let history = useHistory();

    const initialValues = {
      username: "",
      password: ""
    };

    const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(15).required(),
    password: Yup.string().min(4).max(20).required(),
    });

    const onSubmit = (data) => {
       axios.post("http://localhost:3001/auth", data).then((resp) => {
         console.log(data);
         history.push("/login");
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
            <label>Username:</label>
            <ErrorMessage className="error" name="username" component="span" />
            <Field
              id="inputUsername"
              name="username"
              placeholder="(Ex. Maajee...)"
              autocomplete="off"
            />
            <label>Password:</label>
            <ErrorMessage className="error" name="password" component="span" />
            <Field
              id="inputPost"
              type="password"
              name="password"
              placeholder="Your password.."
              autocomplete="off"
            />
            <button type={"submit"} className="btn">
              Register
            </button>
          </Form>
        </Formik>
      </div>
    );
}

export default Registration
