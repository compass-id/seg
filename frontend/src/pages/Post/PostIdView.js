// import dependencies
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

// create the main function
const PostIdView = () => {
  // create the useState
  const [post, setPost] = useState({});
  const [isLoading, setIsLoading] = useState(true); // state for loading
  const [isEmpty, setIsEmpty] = useState(false);

  const { id } = useParams();

  // setting up useNavigate
  const navigate = useNavigate();

  // setting up useEffect to do tasks in real-time

  useEffect(() => {
    // create party loader callback function
    const getPost = async () => {
      try {
        const url = `https://seg-server.vercel.app/api/posts/id/id/${id}`; // modify URL based on backend
        const datas = await axios.get(url); // get datas from URL with axios
        datas.data.length === 0 ? setIsEmpty(true) : setIsEmpty(false);
        setPost(datas.data);
        setIsLoading(false);
      } catch (error) {
        window.alert(error.message); // display error message
      }
    };

    getPost(); // dependency array with only `search`
  }, [id]); // dependency array with only `getParty`

  function formatTime(dateString) {
    // Create a new Date object from the provided dateString
    const date = new Date(dateString);

    // Define arrays for day names and month names
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Get the day of the week, month, day, and year from the Date object
    const dayOfWeek = daysOfWeek[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    // Get the hours and minutes from the Date object
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Format the time as "HH.MM"
    const time = `${hours < 10 ? "0" : ""}${hours}.${
      minutes < 10 ? "0" : ""
    }${minutes}`;

    // Return the formatted date string
    return `${dayOfWeek}, ${day} ${month} ${year}. ${time} WIB`;
  }

  const selMain = (value) => {
    document.getElementById("main").src = document.getElementById(
      `main-${value}`
    ).src;

    value > 0
      ? document.getElementById(`main-${value - 1}`).classList.toggle("active")
      : document.getElementById(`main-${value}`).classList.toggle("active");
  };

  // render the display
  return (
    <>
      <div className="section headline">
        <h4>Post View </h4>
        <button onClick={() => navigate(`/posts`)} className="btn">
          See All Posts
        </button>
      </div>
      {isLoading ? (
        <div className="section">Loading Post Database...</div> // display status when loading
      ) : isEmpty ? (
        <div className="section">No data...</div> // display status when loading
      ) : (
        // display table after loading
        <div className="section">
          <div className="section">
            <div className="posts section" key={post._id}>
              <h3>{post.title}</h3>
              <div className="section"></div>
              <p>{formatTime(post.date)}</p>
              <p>
                <strong>Category:</strong> {post.category}
              </p>
              <p>
                <strong>Tags:</strong> {post.tags}
              </p>
              <div className="section"></div>
              <div className="film">
                <img src={post.banner} alt={post.banner} id="main" />
                <div className="panel">
                  {post.fileList.map((file, index) => (
                    <img
                      src={file.url}
                      alt={file.url}
                      key={index + 1}
                      id={`main-${index + 1}`}
                      onClick={() => selMain(index + 1)}
                    />
                  ))}
                </div>
              </div>
              <div className="section"></div>
              <div className="section"></div>
              <pre dangerouslySetInnerHTML={{ __html: post.body }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// export the main function
export default PostIdView;
