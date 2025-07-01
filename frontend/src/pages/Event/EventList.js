// import dependencies
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// create the main function
const EventList = () => {
  // create the useState
  const [events, setEvents] = useState([]); // state for Event list
  const [searchs, setSearch] = useState(""); // state for search
  const [isLoading, setIsLoading] = useState(true); // state for loading
  const [isEmpty, setIsEmpty] = useState(false);

  const str = searchs;

  // Split the string into words
  const words = str.split(" ");

  // Capitalize the first letter of each word
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );

  // Join the capitalized words back into a string
  const search = capitalizedWords.join(" ");

  // dependency array with only `search`

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
    // create book loader callback function
    const getEvents = async () => {
      try {
        if (!search) {
          const url = `https://seg-server.vercel.app/api/events/`; // modify URL based on backend
          const datas = await axios.get(url); // get datas from URL with axios
          datas.data.length === 0 ? setIsEmpty(true) : setIsEmpty(false);
          setEvents(datas.data);
          setIsLoading(false);
        } else {
          const url = `https://seg-server.vercel.app/api/events/key/${search}`; // modify URL based on backend
          const datas = await axios.get(url); // get datas from URL with axios
          datas.data.length === 0 ? setIsEmpty(true) : setIsEmpty(false);
          setEvents(datas.data);
          setIsLoading(false);
        }
      } catch (error) {
        window.alert(error.message); // display error message
      }
    };

    getEvents();
  }, [search]); // dependency array with only `getEvents`

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
        <h4>Event List</h4>
        <button onClick={() => navigate(`/event-add`)} className="btn">
          Add Event
        </button>
        <div className="section">
          <input
            type="text"
            className="input"
            value={search} // set value from search state
            onInput={(e) => setSearch(e.target.value)} // update search state on change
            placeholder="Search Events..."
          />
        </div>
        <p>Ditemukan: {events.length} data</p>
      </div>
      {isLoading ? (
        <div className="section">Loading Event Database...</div> // display status when loading
      ) : isEmpty ? (
        <div className="section">No data...</div> // display status when loading
      ) : (
        // display table after loading
        <div className="section">
          <div className="section">
            {events.map((event, index) => (
              <div className="event" key={index}>
                <img src={event.img} alt={event.img} />
                <div className="section caption">
                  <h6 title={event.title}>{event.title}</h6>
                  <p title={event.pic}>
                    <strong>Speaker:</strong> {event.pic}
                  </p>
                  <p>
                    <strong>Time:</strong> {formatTime(event.start)}
                  </p>
                  <p title={event.address}>
                    <strong>Location:</strong> {event.address}
                  </p>
                  <p>
                    <strong>Price:</strong> {formatCurrency(event.price)}
                  </p>
                  <button
                    onClick={() => navigate(`/event-edit/${event._id}`)}
                    className="btn"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() => navigate(`/event-view/${event._id}`)}
                    className="btn"
                  >
                    VIEW
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

// export the main function
export default EventList;
