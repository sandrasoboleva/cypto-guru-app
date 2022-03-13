import axios from "axios";
import jwt_decode from "jwt-decode";
import {
  GET_ERRORS,
  SET_CURRENT_USER,
  SET_TEMPORARY_USERNAME_UPON_SUCCESSFUL_REGISTRATION,
  UPDATE_PORTFOLIO
} from "./types";
import setAuthToken from "../utils/setAuthToken";
import { store } from "../store";
import { clearTradeObject, getCurrentPortfolio } from "./tradeActions";

export const registerUser = (userData, history) => async dispatch => {
  try {
    const res = await axios.post(
      "https://crypto-guru-app.herokuapp.com/api/users/register",
      userData,
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
        type: SET_TEMPORARY_USERNAME_UPON_SUCCESSFUL_REGISTRATION,
        payload: res.data.username
      });

      history.push("/registration-successful");
    }
  } catch (error) {
    dispatch({
      type: GET_ERRORS,
      payload: { error: "error" }
    });
  }
};

export const loginUser = userData => async dispatch => {
  try {
    const res = await axios.post(
      "https://crypto-guru-app.herokuapp.com/api/users/login",
      userData,
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          accept: "application/json"
        }
      }
    );

    if (res.status === 200) {
      const { token } = res.data;

      localStorage.setItem("jwtToken", token);

      setAuthToken(token);

      const decoded = jwt_decode(token);

      dispatch(setCurrentUser(decoded));

      dispatch(getCurrentPortfolio());
    }
  } catch (error) {
    dispatch({
      type: GET_ERRORS,
      payload: { error: "error" }
    });
  }
};

export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

export const logoutUser = history => dispatch => {
  localStorage.removeItem("jwtToken");

  setAuthToken(false);

  dispatch(setCurrentUser({}));

  if (history) {
    history.push("/login");
  }

  store.dispatch(clearTradeObject());
};

export const updatePortfolio = (
  authStatus,
  portfolioData
) => async dispatch => {
  try {
    if (authStatus) {
      await axios
        .post(
          "https://crypto-guru-app.herokuapp.com/api/users/update-portfolio",
          portfolioData,
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              accept: "application/json"
            }
          }
        )
        .then(res =>
          dispatch({
            type: UPDATE_PORTFOLIO,
            payload: res.data.portfolio
          })
        );
    }
  } catch (error) {
    dispatch({
      type: UPDATE_PORTFOLIO,
      payload: { error: "error" }
    });
  }
};
