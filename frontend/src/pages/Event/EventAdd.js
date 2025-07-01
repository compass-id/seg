import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EventAdd() {
  // Fetches latest Event count for serie generation (Optional)

  const [selectedFile, setSelectedFile] = useState(null);
  const [eventData, setEventData] = useState({
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
    group: "",
    type: "",
  });

  const handleReset = () => {
    setEventData({
      ...eventData,
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
      group: "",
      type: "",
    });
  };

  // Setting up useNavigate
  const navigate = useNavigate();

  const handleChange = (event) => {
    if (event.target.value !== "") {
      setEventData({
        ...eventData,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleFile = (event) => {
    setSelectedFile(event.target.files[0]);
    // Access the filename from the selected file
    const fileDir = "https://compasspubindonesia.com/media/api/events/img/";
    const file = event.target.files[0];
    const filename = fileDir + file.name;
    setEventData({
      ...eventData,
      img: filename,
    });
  };

  const AddEvent = async (e) => {
    e.preventDefault();

    const cleanedData = {
      ...eventData,
    };

    const formData = new FormData();
    formData.append("img", selectedFile);

    try {
      // Add the Event into database with axios
      await axios.post(`https://seg-server.vercel.app/api/events`, cleanedData);
      await axios.post(
        `https://compasspubindonesia.com/media/api/events/index.php`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Navigate to main page
      navigate(`/events`);
    } catch (error) {
      window.alert(error.message); // Display error messages
    }
  };

  return (
    <>
      <div className="section">
        <div className="section headline">
          <h4>Add Event</h4>
          <button onClick={() => navigate(`/events`)} className="btn">
            See All Events
          </button>
        </div>
        <div className="section">
          <form onSubmit={AddEvent} className="form">
            <div className="field">
              <label className="label">Name</label>
              <input
                type="text"
                className="input"
                id="title"
                name="title"
                value={eventData.title}
                onChange={handleChange}
                placeholder="Event Name"
              />
            </div>
            <div className="field">
              <label className="label">Form Type</label>
              <select
                name="type"
                value={eventData.type}
                onChange={handleChange}
              >
                <option value="">--- Select Form Type ---</option>
                <option value="Registration">Registration</option>
                <option value="Booking">Booking</option>
                <option value="Survey">Survey</option>
                <option value="Agent">Agent</option>
              </select>
            </div>
            <div className="field">
              <label className="label">Model</label>
              <select
                name="model"
                value={eventData.model}
                onChange={handleChange}
              >
                <option value="">--- Select Model ---</option>
                <option value="Online">Online</option>
                <option value="Onsite">Onsite</option>
                <option value="Hybrid (Online & Onsite)">Hybrid</option>
              </select>
            </div>
            <div className="field">
              <label className="label">Start</label>
              <input
                type="datetime-local"
                className="input"
                id="start"
                name="start"
                value={eventData.start}
                onChange={handleChange}
                placeholder="Start"
              />
            </div>
            <div className="field">
              <label className="label">End</label>
              <input
                type="datetime-local"
                className="input"
                id="end"
                name="end"
                value={eventData.end}
                onChange={handleChange}
                placeholder="End"
              />
            </div>
            <div className="field">
              <label className="label">Speaker(s)</label>
              <input
                type="text"
                className="input"
                id="pic"
                name="pic"
                value={eventData.pic}
                onChange={handleChange}
                placeholder="Speaker 1, Speaker 2, Speaker 3..."
              />
            </div>
            <div className="field">
              <label className="label">Price</label>
              <input
                type="number"
                className="input"
                id="price"
                name="price"
                value={eventData.price}
                onChange={handleChange}
                placeholder="Event Price in Rupiah"
              />
            </div>
            <div className="field">
              <label className="label">Contact Email/Phone</label>
              <input
                type="text"
                className="input"
                id="contact"
                name="contact"
                value={eventData.contact}
                onChange={handleChange}
                placeholder="Contact of Committee"
              />
            </div>
            <div className="field">
              <label className="label">WhatsApp Group</label>
              <input
                type="text"
                className="input"
                id="group"
                name="group"
                value={eventData.group}
                onChange={handleChange}
                placeholder="WhatsApp Group Link"
              />
            </div>
            <div className="field">
              <label className="label">Address</label>
              <textarea
                type="text"
                className="input"
                id="address"
                name="address"
                value={eventData.address}
                onChange={handleChange}
                placeholder="Event Address"
              ></textarea>
            </div>
            <div className="field">
              <label className="label">Description</label>
              <textarea
                type="text"
                className="input"
                id="desc"
                name="desc"
                value={eventData.desc}
                onChange={handleChange}
                placeholder="Event Description"
              ></textarea>
            </div>
            <div className="field">
              <label className="label">Image</label>
              <input
                type="file"
                className="input"
                id="img"
                name="img"
                onChange={handleFile}
                placeholder="Event Image"
              />
            </div>
            <div className="section">
              <div className="controls">
                <button type="button" className="btn" onClick={handleReset}>
                  Reset
                </button>
                <button type="submit" className="btn">
                  Create
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EventAdd;
