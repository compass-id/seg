// import router kit
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Login,
  PostAdd,
  PostList,
  PostEnView,
  PostIdView,
  PostEnEdit,
  PostIdEdit,
} from "./pages";
import { Navigation } from "./components";
import Cookies from "js-cookie";

const App = () => {
  const [isLogin, setIsLogin] = useState();

  useEffect(() => {
    const getLogin = async () => {
      const logged = Cookies.get("isLogin");
      logged !== undefined ? setIsLogin(true) : setIsLogin(false);
    };
    getLogin();
  }, [isLogin]);

  return (
    <>
      {isLogin === true ? (
        <Router>
          <Navigation />
          <div className="main-page">
            <Routes>
              <Route path="/" element={<PostList />} />
              <Route path="/posts" element={<PostList />} />
              <Route path="/post-add" element={<PostAdd />} />
              <Route path="/post-edit/en/:id" element={<PostEnEdit />} />
              <Route path="/post-edit/id/:id" element={<PostIdEdit />} />
              <Route path="/post-view/en/:id" element={<PostEnView />} />
              <Route path="/post-view/id/:id" element={<PostIdView />} />
            </Routes>
          </div>
        </Router>
      ) : (
        <Router>
          <Navigation />
          <div className="main-page">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/admin-login" element={<Login />} />
            </Routes>
          </div>
        </Router>
      )}
    </>
  );
};

export default App;
