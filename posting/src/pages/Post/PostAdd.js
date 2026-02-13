import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PostAdd() {
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [selectedFile, setSelectedFile] = useState([]);
  const [postData, setPostData] = useState({
    title: "",

    category: "",
    body: "",
    date: "",
    tags: "",
    lang: "",
    banner: "",
    fileList: [],
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const formattedDate = `-${day}-${month}-${year}`;

    const cleanData = {
      ...postData,
      [e.target.name]: e.target.value,
    };

    setPostData(cleanData);
  };

  const handleBanner = (event) => {
    const fileDir = "https://compasspubindonesia.com/media/api/posts/img/";
    const file = event.target.files[0];
    const filename = fileDir + file.name;
    setSelectedBanner(file);
    setPostData({
      ...postData,
      banner: filename,
    });
  };

  const handleFile = (event) => {
    const fileDir = "https://compasspubindonesia.com/media/api/posts/img/";
    const files = Array.from(event.target.files);
    const filenames = files.map((file) => ({
      url: fileDir + file.name,
    }));
    setSelectedFile(files);
    setPostData({
      ...postData,
      fileList: filenames,
    });
  };

  const AddPost = async (e) => {
    e.preventDefault();
    document.getElementById("submit").innerText = "Saving data, please wait...";
    document.getElementById("submit").type = "reset";

    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const formattedDate = `-${day}-${month}-${year}`;

    const cleanedData = {
      ...postData,
    };

    const bannerData = new FormData();
    bannerData.append("banner", selectedBanner);

    const fileData = new FormData();
    selectedFile.forEach((file) => {
      fileData.append("fileList[]", file); // Append each file with `fileList[]` key
    });

    let url =
      postData.lang === "id"
        ? `https://seg-server.vercel.app/api/posts/id`
        : `https://seg-server.vercel.app/api/posts/en`;

    try {
      await axios.post(url, cleanedData);
      await axios.post(
        `https://compasspubindonesia.com/media/api/posts/banner.php`,
        bannerData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      await axios.post(
        `https://compasspubindonesia.com/media/api/posts/files.php`,
        fileData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      navigate(`/posts`);
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <>
      <div className="section">
        <div className="section headline">
          <h4>Add Post</h4>
          <button onClick={() => navigate(`/posts`)} className="btn">
            See All Posts
          </button>
        </div>
        <div className="section">
          <form onSubmit={AddPost} className="form posti">
            <div className="field">
              <label className="label">Title</label>
              <input
                type="text"
                className="input"
                id="title"
                name="title"
                value={postData.title}
                onChange={handleChange}
                placeholder="Title"
              />
            </div>

            <div className="field">
              <label className="label">Category</label>
              <input
                type="text"
                className="input"
                id="category"
                name="category"
                value={postData.category}
                onChange={handleChange}
                placeholder="Category"
              />
            </div>
            <div className="field">
              <label className="label">Tags</label>
              <input
                type="text"
                className="input"
                id="tags"
                name="tags"
                value={postData.tags}
                onChange={handleChange}
                placeholder="Tags"
              />
            </div>
            <div className="field">
              <label className="label">Language</label>
              <select name="lang" value={postData.lang} onChange={handleChange}>
                <option value="">--- Select Language ---</option>
                <option value="en">English</option>
                <option value="id">Indonesia</option>
              </select>
            </div>
            <div className="field">
              <label className="label">Date</label>
              <input
                type="datetime-local"
                className="input"
                id="date"
                name="date"
                value={postData.date}
                onChange={handleChange}
                placeholder="Date"
              />
            </div>
            <div className="field">
              <label className="label">Banner (Cover Image for the Post)</label>
              <input type="file" className="input" onChange={handleBanner} />
            </div>
            <div className="field">
              <label className="label">Featured Images (Max. 10)</label>
              <input
                type="file"
                className="input"
                multiple
                onChange={handleFile}
              />
            </div>
            <div className="field" style={{ width: "100%" }}>
              <label className="label">Caption</label>
              <textarea
                type="text"
                className="input"
                id="body"
                name="body"
                value={postData.body}
                onChange={handleChange}
                placeholder="Write captions here..."
                style={{ height: "400px" }}
              ></textarea>
            </div>
            <div className="section">
              <div className="controls">
                <button type="submit" className="btn" id="submit">
                  Create This Post
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default PostAdd;
