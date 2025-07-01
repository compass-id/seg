import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EventPartyEdit() {
  // Fetches latest Event count for serie generation (Optional)

  const { id } = useParams();

  const [selectedFile, setSelectedFile] = useState(null);

  const [eventData, setEventData] = useState({
    name: "",
    company: "",
    job: "",
    email: "",
    phone: "",
    address: "",
    referral: "",
  });

  const handleFile = (event) => {
    if (event.target.files[0] !== null) {
      setSelectedFile(event.target.files[0]);
      // Access the filename from the selected file
      const fileDir = "https://compasspubindonesia.com/media/api/events/img/";
      const file = event.target.files[0];
      const filename = fileDir + file.name;
      setEventData({
        ...eventData,
        img: filename,
      });
    }
  };

  // Setting up useNavigate
  const navigate = useNavigate();

  const handleChange = (event) => {
    // For non-file inputs, set the value directly
    setEventData({
      ...eventData,
      [event.target.name]: event.target.value,
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
      await axios.patch(
        `https://seg-server.vercel.app/api/parties/id/${id}`,
        cleanedData
      );
      await axios.post(
        `https://compasspubindonesia.com/media/api/bills/index.php`,
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

  // create Event deleter function
  const delEvent = async () => {
    if (window.confirm("Delete this?") === true) {
      try {
        await axios.delete(
          `https://seg-server.vercel.app/api/parties/id/${id}`
        ); // modify URL based on backend
        // navigate to main page
        navigate(`/events`);
      } catch (error) {
        window.alert(error.message); // display error message
      }
    } else {
    }
  };

  useEffect(() => {
    // create party loader callback function
    const getEvent = async () => {
      try {
        const url = `https://seg-server.vercel.app/api/parties/id/${id}`; // modify URL based on backend
        const datas = await axios.get(url); // get datas from URL with axios

        setEventData(datas.data);
      } catch (error) {
        window.alert(error.message); // display error message
      }
    };

    getEvent(); // dependency array with only `search`
  }, [id]); // dependency array with only `getParty`

  return (
    <>
      <div className="section">
        <div className="section headline">
          <h4>Add Participant</h4>
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
                id="name"
                name="name"
                value={eventData.name}
                onChange={handleChange}
                placeholder="Event Name"
                required
              />
            </div>
            <div className="field">
              <label className="label">Occupation</label>
              <select
                id="job"
                name="job"
                value={eventData.job}
                onChange={handleChange}
              >
                <option value="">--- Select Occupation ---</option>
                <option value="Headmaster">Headmaster</option>
                <option value="Teacher">Teacher</option>
                <option value="Tutor">Tutor</option>
                <option value="Parent">Parent</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="field">
              <label className="label">Company/Agency</label>
              <input
                type="text"
                className="input"
                id="company"
                name="company"
                value={eventData.company}
                onChange={handleChange}
                placeholder="Company/Agency"
              />
            </div>
            <div className="field">
              <label className="label">Email</label>
              <input
                type="text"
                className="input"
                id="email"
                name="email"
                value={eventData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
            </div>
            <div className="field">
              <label className="label">Phone</label>
              <input
                type="text"
                className="input"
                id="phone"
                name="phone"
                value={eventData.phone}
                onChange={handleChange}
                placeholder="Phone"
                required
              />
            </div>
            <div className="field">
              <label className="label">Attendance | Kehadiran</label>
              <select
                id="room"
                name="room"
                value={eventData.room}
                onChange={handleChange}
              >
                <option value="">
                  --- Select Attendance | Pilih Kehadiran ---
                </option>
                <option value="Online">Online | Daring</option>
                <option value="Onsite">Onsite | Luring</option>
              </select>
            </div>
            <div className="field">
              <label className="label">City</label>
              <textarea
                type="text"
                className="input"
                id="address"
                name="address"
                value={eventData.address}
                onChange={handleChange}
                placeholder="City"
                required
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
                value={eventData.img}
              />
            </div>
            <div className="section">
              <div className="controls">
                <button type="button" onClick={delEvent} className="btn">
                  Delete
                </button>
                <button type="submit" className="btn">
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

export default EventPartyEdit;
