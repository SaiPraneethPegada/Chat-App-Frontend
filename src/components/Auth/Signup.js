import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { VisibilityOff } from "@mui/icons-material";
import Visibility from "@mui/icons-material/Visibility";
import { Spinner } from "react-bootstrap";
import { API_URL } from "../../App";
import IntroNavBar from "./IntroNavBar";

function Signup() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");
  const [picName, setPicName] = useState("");
  const [picThumbnail, setPicThumbnail] = useState("");
  const [message, setMessage] = useState("");
  const [submitBtn, setSubmitBtn] = useState("Submit");
  const [status, setStatus] = useState("primary");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  let navigate = useNavigate();
  const togglePw = () => setShowPw(!showPw);

  const handleWidget = async (e) => {
    var myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: "praneethpsp",
        uploadPreset: "Chat App",
        sources: ["local", "url", "google_drive"],
        preBatch: (cb, data) => {
          let file = data.files[0].name;
          let format = file.substr(file.length - 4);
          // console.log(format);
          switch (format) {
            case ".png":
              cb();
              break;

            case ".jpg":
              cb();
              break;

            case "jpeg":
              cb();
              break;

            default:
              cb({ cancel: true });
              alert("Only '.jpg', '.png' and 'jpeg' format supported");
          }
        },
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          // console.log("Done! Here is the image info: ", result.info);
          setPic(result.info.url);
          setPicName(result.info.original_filename);
          setPicThumbnail(result.info.secure_url);
        }
        if (error) {
          alert("error in uploading picture");
        }
      }
    );
    myWidget.open();
  };

  const handleSubmit = async () => {
    if (email !== "" && userName !== "" && password !== "") {
      try {
        setLoading(true);
        let res = await axios.post(`${API_URL}/signup`, {
          userName,
          email,
          password,
          pic,
        });
        // console.log(res);
        if (res.data.statusCode === 200) {
          alert(res.data.message);
          navigate("/login");
        } else {
          setMessage(res.data.message);
          setStatus("error");
          setSubmitBtn("Retry");
        }
      } catch (error) {
        setMessage(error.message);
      }
    } else {
      alert("Please fill all the fields");
    }
    setLoading(false);
  };

  return (
    <>
      <IntroNavBar />
      <form className="shadow-form container d-grid col-md-6 col-lg-4 p-5 gap-4 mt-5 shadow rounded-3">
        <h2 className="text-center"> SignUp</h2>
        <TextField
          type="text"
          name="userName"
          label="userName"
          variant="outlined"
          required
          onChange={(e) => setUserName(e.target.value)}
        />

        <TextField
          type="email"
          name="email"
          label="Email"
          variant="outlined"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          type={showPw ? "text" : "password"}
          name="password"
          label="Password"
          variant="outlined"
          value={password}
          required
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
        <div className="d-flex align-items-center flex-wrap">
          <Button variant="outlined" onClick={(e) => handleWidget(e)}>
            Upload Pic
          </Button>
          <div className="mx-3">
            {picThumbnail ? (
              <img
                src={picThumbnail}
                alt={picName}
                width="35px"
                height="35px"
              />
            ) : (
              ""
            )}
          </div>
          <div className="">{picName ? picName : ""}</div>
        </div>
        <Button
          color={status}
          variant="contained"
          onClick={() => handleSubmit()}
        >
          {loading ? <Spinner animation="border" variant="light" /> : submitBtn}
        </Button>
        <div className="d-flex justify-content-end">
          <Link to="/login" className="text-decoration-none">
            Already Registered??
          </Link>
        </div>
        {message ? (
          <div className="text-center text-danger">{message}</div>
        ) : (
          <></>
        )}
      </form>
    </>
  );
}

export default Signup;
