import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Tooltip } from "@mui/material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import Spinner from "react-bootstrap/Spinner";
import IntroNavBar from "./IntroNavBar";
import { API_URL } from "../../App";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitBtn, setSubmitBtn] = useState("Submit");
  const [status, setStatus] = useState("primary");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const navigate = useNavigate();

  const togglePw = () => setShowPw(!showPw);

  let handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // console.log(email, password);
    if (email && password) {
      let res = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      if (res.data.statusCode === 200) {
        window.sessionStorage.setItem(
          "userInfo",
          JSON.stringify(res.data.userInfo)
        );
        navigate("/home");
      } else {
        setMessage(res.data.message);
        setStatus("error");
        setSubmitBtn("Retry");
      }
    } else {
      alert("please enter your credentials");
    }
    setLoading(false);
  };

  return (
    <>
      <IntroNavBar />

      <div className="mt-5 d-flex ">
        <form className="shadow-form container d-grid gap-4 col-md-6 col-lg-4 pt-5 px-5 mt-5 shadow rounded-3">
          <h2 className="text-center">Login</h2>
          <TextField
            type="text"
            name="email"
            label="Email"
            value={email}
            variant="outlined"
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            type={showPw ? "text" : "password"}
            name="password"
            label="Password"
            variant="outlined"
            value={password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePw}
                    edge="end"
                  >
                    {showPw ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            color={status}
            variant="contained"
            onClick={(e) => handleSubmit(e)}
          >
            {loading ? (
              <Spinner animation="border" variant="light" />
            ) : (
              submitBtn
            )}
          </Button>

          <div className="d-flex justify-content-end ">
            <Link to="/signup" className="text-decoration-none">
              Not Registered??
            </Link>
          </div>

          <div className="d-flex justify-content-center">
            <Tooltip title="Guest login demo credentials">
              <Button
                variant="outlined"
                className="me-3"
                onClick={() => {
                  setEmail("guest@guest.com");
                  setPassword("Guest@123");
                }}
              >
                Guest
              </Button>
            </Tooltip>
            <Tooltip variant="outlined" title="Guest1 login demo credentials">
              <Button
                onClick={() => {
                  setEmail("guest1@guest.com");
                  setPassword("Guest@123");
                }}
              >
                Guest1
              </Button>
            </Tooltip>
          </div>

          <span className="mt-0 mb-4">
            {message ? (
              <div className="text-danger text-center">{message}</div>
            ) : (
              <></>
            )}
          </span>
        </form>
      </div>
    </>
  );
};

export default Login;
