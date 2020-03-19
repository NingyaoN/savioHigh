import React, { useState, Fragment } from "react";
import { Formik, Form, Field } from "formik";
import { css } from "@emotion/core";
import DotLoader from "react-spinners/DotLoader";
import Axios from 'axios';



const override = css`
  display: flex;
  margin: auto;
  border-color: red;
  text-align:center;

`;


function validateEmail(value) {
  let error;

  if (!value) {
    error = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    error = "Invalid email address";
  }

  return error;
}

function validateName(value) {
  let error;

  if (value === "admin") {
    error = "Nice try!";
  }

  return error;
}

function validatePhone(value) {
  let error;

  if (value === "admin") {
    error = "Nice try!";
  }

  return error;
}

function validateStatus(value) {
  let error;

  if (value === "admin") {
    error = "Nice try!";
  }

  return error;
}

const font = {
  fontSize: "10px",
  fontStyle: "italic",
  color: "red"
}

export const EditForm = (props) => {
  const [loading, setLoading] = useState(false);

  const [isEdit, setEdit] = useState(false);
  const [disabled, setDisabled] = useState("disabled");
  const editToggle = () => {
    setEdit(!isEdit)
    setDisabled(!disabled)
  }


  const onSubmit = values => {
    setLoading(true)
    Axios.post(`user/${props.profile._id}/update`, { values })
      .then((response) => {
        console.log(response)
        setLoading(false);
        window.location.reload();
      })
  };

  if (loading) {
    return (
      <div className="App">
        <div className="App-header">
          <div className=" sweet-loading">
            <DotLoader
              css={override}
              size={150}
              color={"#123abc"}
              loading={loading}
            />
            <p style={{ color: "black" }}>Fetching Data...</p>
          </div>
        </div>
      </div>
    )
  } else {

    return (
     <Fragment>
       <div>
       <button onClick={editToggle} className="btn btn-sm btn-outline-danger mb-1 float-right">{(isEdit) ? "Cancel" : "Edit"}</button>
       </div>
       <div>
       <Formik
        initialValues={{
          name: props.profile.name,
          email: props.profile.email,
          phone: props.profile.phone,
          status: props.profile.bio || "Please Update Status",

        }}
        onSubmit={onSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <Field name="name" validate={validateName} className="form-control mb-3"  disabled={(disabled) ? "disabled" : ""} />
            <span style={font}>
              {errors.name && touched.name && errors.name}
            </span>
           

            
            <Field name="email" validate={validateEmail} className="form-control mb-3"  disabled={(disabled) ? "disabled" : ""}/>
            {errors.email && touched.email && errors.email}

            {/* <button onClick={editToggle} className="btn btn-sm btn-outline-danger mb-1 float-right">{(isEdit) ? "Cancel" : "Edit"}</button> */}
            <Field name="phone" validate={validatePhone} className="form-control mb-3"  disabled={(disabled) ? "disabled" : ""} />
            {errors.phone && touched.phone && errors.phone}

            {/* <button onClick={editToggle} className="btn btn-sm btn-outline-danger mb-1 float-right">{(isEdit) ? "Cancel" : "Edit"}</button> */}
            <Field name="status" validate={validateStatus} className="form-control mb-3"   disabled={(disabled) ? "disabled" : ""}/>
            {errors.status && touched.status && errors.status}



            <button className="btn btn-sm btn-outline-danger float-left">Cancel</button>
            <button type="submit" className="btn btn-sm btn-outline-success float-right">Save Changes</button>
          </Form>
        )}
      </Formik>
       </div>
     </Fragment>
    );
  }
};




