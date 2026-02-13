import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function PostEnEdit() {
  // Fetches latest Post count for serie generation (Optional)

  // get id from parameter
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [selectedFile, setSelectedFile] = useState([]);
  const { id } = useParams();

  const [postData, setPostData] = useState([]);

  // Setting up useNavigate
  const navigate = useNavigate();

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

  // create Event deleter function
  const delPost = async () => {
    let url = `https://seg-server.vercel.app/api/posts/en/id/${id}`;

    if (window.confirm("Delete this?") === true) {
      try {
        await axios.delete(url); // modify URL based on backend
        // navigate to main page
        navigate(`/posts`);
      } catch (error) {
        window.alert(error.message); // display error message
      }
    } else {
    }
  };

  const handleChange = (e) => {
    // For non-file inputs, set the value directly

    const cleanData = {
      ...postData,
      [e.target.name]: e.target.value,
    };

    setPostData(cleanData);
  };

  const EditPost = async (e) => {
    e.preventDefault();

    document.getElementById("submit").innerText = `Updating data...`;
    document.getElementById("submit").type = `reset`;

    const cleanedData = {
      ...postData,
    };

    const bannerData = new FormData();
    bannerData.append("banner", selectedBanner);

    const fileData = new FormData();
    selectedFile.forEach((file) => {
      fileData.append("fileList[]", file); // Append each file with `fileList[]` key
    });

    let url = `https://seg-server.vercel.app/api/posts/en/id/${id}`;

    try {
      const response1 = await axios.patch(url, cleanedData);
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
      console.log("Response from main API:", response1.data);

      navigate(`/posts`);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  // setting up useEffect to do tasks in real-time
  useEffect(() => {
    // create Event loader callback function
    const getPostById = async () => {
      let url = `https://seg-server.vercel.app/api/posts/en/id/${id}`;
      try {
        // get all the datas from database with axios
        const res = await axios.get(url);

        // input all the datas into useState
        setPostData(res.data);
      } catch (error) {
        console.log(error); // display error message
      }
    };

    getPostById();
  }, [id]);

  return (
    <>
      <div className="section">
        <div className="section headline">
          <h4>Edit Post</h4>
          <button onClick={() => navigate(`/posts`)} className="btn">
            See All Posts
          </button>
        </div>
        <div className="section">
          <form onSubmit={EditPost} className="form posti">
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
                <button type="button" onClick={delPost} className="btn">
                  Delete
                </button>
                <button type="submit" className="btn" id="submit">
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default PostEnEdit;
