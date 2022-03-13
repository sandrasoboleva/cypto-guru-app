import axios from "axios";
import {
  GET_PROFILE,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
  GET_ERRORS,
  SET_CURRENT_USER
} from "./types";
import setAuthToken from "../utils/setAuthToken";
import { setCurrentUser } from "./authActions";

export const getCurrentProfile = () => async dispatch => {
  try {
    dispatch(setProfileLoading());
    const res = await axios.get(
      "https://crypto-guru-app.herokuapp.com/api/profile",
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          accept: "application/json"
        }
      }
    );
    if (res.status === 200) {
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
    }
  } catch (error) {
    dispatch({
      type: GET_PROFILE,
      payload: { error: "error" }
    });
  }
};

export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};

export const createProfile = profileData => async dispatch => {
  try {
    const res = await axios.post(
      "https://crypto-guru-app.herokuapp.com/api/profile",
      profileData,
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          accept: "application/json"
        }
      }
    );

    console.log(res);

    if (res.status === 200) {
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
    }
  } catch (error) {
    dispatch({
      type: GET_ERRORS,
      payload: { error: "Error creating profile" }
    });
  }
};

export const deleteAccount = () => dispatch => {
  if (window.confirm("Are you sure? This cannot be undone!")) {
    axios
      .delete("https://crypto-guru-app.herokuapp.com/api/profile")
      .then(res =>
        dispatch({
          type: SET_CURRENT_USER,
          payload: {}
        })
      )
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: { error: "Error deleting profile" }
        })
      );

    localStorage.removeItem("jwtToken");

    setAuthToken(false);

    dispatch(setCurrentUser({}));
  }
};
