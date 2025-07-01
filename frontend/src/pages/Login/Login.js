import React, { useState } from "react";
import Cookies from "js-cookie";

function Login() {
  const [data, setData] = useState({
    user: "",
    pass: "",
  });

  const handleChange = (event) => {
    event.preventDefault();
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  const handleLogin = (event) => {
    event.preventDefault();
    // Replace with your actual login logic (e.g., API calls)
    if (data.user === "compassid" && data.pass === "compasspub2024") {
      Cookies.set("isLogin", "true", { expires: 7 });
      window.location.replace(`/`);
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <>
      <div className="section log-banner">
        <img
          src="https://github.com/competech-id/seg/raw/master/frontend/public/favicon.ico"
          alt=""
        />
        <div>
          <p>
            <strong>COMPASS PUBLISHING INDONESIA</strong>
          </p>
          <p>PT Solusi Edukasi Gemilang</p>
          <hr />
        </div>
      </div>
      <div className="section headline">
        <h4>Login Dashboard</h4>
      </div>
      <form onSubmit={handleLogin} className="form">
        <div className="field">
          <label className="label">Username</label>
          <input
            type="text"
            className="input"
            id="user"
            name="user"
            value={data.user}
            onChange={handleChange}
            placeholder="Username"
          />
        </div>
        <div className="field">
          <label className="label">Password</label>
          <input
            type="text"
            className="input"
            id="pass"
            name="pass"
            value={data.pass}
            onChange={handleChange}
            placeholder="Password"
          />
        </div>

        <div className="section">
          <div className="controls" style={{ textAlign: "right" }}>
            <button
              type="button"
              onClick={() => window.open("https://wa.me/6285174448002")}
              className="btn"
            >
              Contact CS
            </button>
            <button type="submit" className="btn">
              Login As Admin
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default Login;
