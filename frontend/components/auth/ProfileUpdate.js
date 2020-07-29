import Link from "next/link";

import { useState, useEffect } from "react";

import Router from "next/router";

import { getCookie, isAuth, updateUser } from "../../actions/auth";

import { getProfile, update } from "../../actions/user";

import { API } from "../../config";

const ProfileUpdate = () => {
  const [values, setValues] = useState({
    username: "",
    name: "",
    email: "",
    about: "",
    password: "",
    error: false,
    success: false,
    loading: false,
    photo: "",
    userData: "",
  });

  const token = getCookie("token");

  const {
    username,
    name,
    email,
    about,
    password,
    error,
    success,
    loading,
    photo,
    userData,
  } = values;

  const init = () => {
    getProfile(token).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.err });
      } else {
        setValues({
          ...values,
          username: data.username,
          name: data.name,
          email: data.email,
          about: data.about,
          photo: data.photo
        });
      }
    });
  };

  useEffect(() => {
    init();
  }, []);

  const handleChange = (name) => (e) => {
    /** Grab file name for the photo, and value for otherwise */
    const value = name === "photo" ? e.target.files[0] : e.target.value;

    /** Instance a from data */
    let userFormData = new FormData();

    /**
     * Populate the form data when component loaded in the through useEffect
     * @arg { Any } name - element's name
     * @arg { Any } value - file's/field's value
     */
    userFormData.set(name, value);

    /** Update the state */
    setValues({
      ...values,
      [name]: value,
      userData: userFormData,
      error: false,
      success: false,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, loading: true });
    update(token, userData).then((data) => {
      if (data && data.error) {
        setValues({
          ...values,
          error: data.error,
          success: false,
          loading: false,
        });
      } else {
        updateUser(data, () => {
          setValues({
            ...values,
            username: data.username,
            name: data.name,
            email: data.email,
            about: data.about,
            photo: data.photo,
            success: true,
            loading: false,
          });
        });
      }
    });
  };

  const profileUpdateForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="btn btn-outline-info">
            Profile photo
            <input
              onChange={handleChange("photo")}
              type="file"
              accept="image/*"
              hidden
            />
          </label>
        </div>
        <div className="form-group">
          <label className="text-muted">Username</label>
          <input
            onChange={handleChange("username")}
            type="text"
            value={username}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Name</label>
          <input
            onChange={handleChange("name")}
            type="text"
            value={name}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Email</label>
          <input
            onChange={handleChange("email")}
            type="text"
            value={email}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label className="text-muted">About</label>
          <textarea
            onChange={handleChange("about")}
            type="text"
            value={about}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Password</label>
          <input
            onChange={handleChange("password")}
            type="password"
            value={password}
            className="form-control"
          />
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    );
  };

  const showError = () => {
    return (
      <div
        className="alert alert-danger"
        style={{ display: error ? "" : "none" }}
      >
        {error}
      </div>
    );
  };

  const showSuccess = () => {
    return (
      <div
        className="alert alert-success"
        style={{ display: success ? "" : "none" }}
      >
        Profile updated
      </div>
    );
  };

  const showLoading = () => {
    return (
      <div
        className="alert alert-info"
        style={{ display: loading ? "" : "none" }}
      >
        Loading...
      </div>
    );
  };

  return (
    <React.Fragment>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h2>{`${API}/user/photo/${username}`}</h2>
            <img
              src={`${API}/user/photo/${username}`}
              className="img img-fluid img-thumbnail mb-3"
              style={{ maxHeight: "auto", maxWidth: "100%" }}
              alt="user profile"
            />
          </div>
          <div className="col-md-8 mb-5">
            {showSuccess()}
            {showError()}
            {showLoading()}
            {profileUpdateForm()}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ProfileUpdate;
