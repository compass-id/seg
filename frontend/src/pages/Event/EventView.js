// import dependencies
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

// create the main function
const EventView = () => {
  // create the useState
  const [event, setEvent] = useState({
    price: "",
    model: "",
    title: "",
    desc: "",
    pic: "",
    img: "",
    address: "",
    start: "",
    end: "",
    contact: "",
  });
  const [isLoading, setIsLoading] = useState(true); // state for loading
  const [isEmpty, setIsEmpty] = useState(false);

  const { id } = useParams();

  // setting up useNavigate
  const navigate = useNavigate();

  // create currency format function
  function formatCurrency(number) {
    // define options for formatting
    const options = {
      style: "currency", // set currency
      currency: "IDR", // set currency code for Indonesian Rupiah (IDR)
      minimumFractionDigits: 2, // set minimum decimal places to 2
      maximumFractionDigits: 2, // set maximum decimal places to 2
    };

    // use toLocaleString() with the defined options
    return new Intl.NumberFormat("id-ID", options).format(number);
  }

  // setting up useEffect to do tasks in real-time

  useEffect(() => {
    // create party loader callback function
    const getEvent = async () => {
      try {
        const url = `https://seg-server.vercel.app/api/events/id/${id}`; // modify URL based on backend
        const datas = await axios.get(url); // get datas from URL with axios
        datas.data.length === 0 ? setIsEmpty(true) : setIsEmpty(false);
        setEvent(datas.data);
        setIsLoading(false);
      } catch (error) {
        window.alert(error.message); // display error message
      }
    };

    getEvent(); // dependency array with only `search`
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

  // render the display
  return (
    <>
      <div className="section headline">
        <h4>Event View</h4>
        <button onClick={() => navigate(`/events`)} className="btn">
          See All Events
        </button>
      </div>
      {isLoading ? (
        <div className="section">Loading Event Database...</div> // display status when loading
      ) : isEmpty ? (
        <div className="section">No data...</div> // display status when loading
      ) : (
        // display table after loading
        <div className="section">
          <div className="section">
            <div className="view" key={event._id}>
              <img src={event.img} alt={event.img} />
              <div className="section caption">
                <h4 title={event.title}>{event.title}</h4>
                <p title={event.pic}>
                  <strong>Speaker:</strong>
                </p>
                <p> {event.pic}</p>
                <p>
                  <strong>Role:</strong>
                </p>
                <p> {event.model}</p>
                <p>
                  <strong>Start:</strong>
                </p>
                <p> {formatTime(event.start)}</p>
                <p>
                  <strong>Finish:</strong>
                </p>
                <p>{formatTime(event.end)}</p>
                <p>
                  <strong>Price:</strong>
                </p>
                <p>{formatCurrency(event.price)}</p>
                <p>
                  <strong>Location:</strong>
                </p>
                <p>{event.address}</p>
                <p>
                  <strong>Description:</strong>
                </p>
                <pre>{event.desc}</pre>
                <button
                  onClick={() => navigate(`/event-join-list/${event._id}`)}
                  className="btn"
                >
                  VIEW PARTICIPANT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// export the main function
export default EventView;
