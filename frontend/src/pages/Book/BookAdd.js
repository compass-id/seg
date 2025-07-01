// import dependencies
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// create the main function
const BookAdd = () => {
  // create the useState
  const [name, setName] = useState("");
  const [isbn, setIsbn] = useState("");
  const [category, setCategory] = useState("");
  const [bookPrice, setBookPrice] = useState("");
  const [ebookPrice, setEbookPrice] = useState("");

  const handleReset = () => {
    setName("");
    setIsbn("");
    setCategory("");
    setBookPrice("");
    setEbookPrice("");
  };

  // setting up useNavigate
  const navigate = useNavigate();

  // create the save book function
  const saveBook = async (e) => {
    try {
      // save the book into database with axios
      await axios.post(`https://seg-server.vercel.app/api/books`, {
        name,
        isbn,
        category,
        bookPrice,
        ebookPrice,
      });

      // navigate to main page
      navigate(`/`);
    } catch (error) {
      window.alert(error.message); // display error message
    }
  };

  // display input form to Add data
  return (
    <>
      <div className="section">
        <div className="section headline">
          <h4>Add Book</h4>
          <button onClick={() => navigate(`/`)} className="btn">
            See All Books
          </button>
        </div>
        <div className="section">
          <form onSubmit={saveBook} className="form">
            <div className="field">
              <label className="label">Book Name</label>
              <input
                type="text"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Book Name"
              />
            </div>
            <div className="field">
              <label className="label">ISBN</label>
              <input
                type="text"
                className="input"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="ISBN"
              />
            </div>
            <div className="field">
              <label className="label">Category</label>
              <input
                type="text"
                className="input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Category"
              />
            </div>
            <div className="field">
              <label className="label">Book Price</label>
              <input
                type="number"
                className="input"
                value={bookPrice}
                onChange={(e) => setBookPrice(e.target.value)}
                placeholder="Book Price"
              />
            </div>
            <div className="field">
              <label className="label">E-Book Price</label>
              <input
                type="number"
                className="input"
                value={ebookPrice}
                onChange={(e) => setEbookPrice(e.target.value)}
                placeholder="E-Book Price"
              />
            </div>
            <div className="field">
              <div className="controls">
                <button type="button" className="btn" onClick={handleReset}>
                  Reset
                </button>
                <button type="sumbit" className="btn">
                  Create
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// export the main function
export default BookAdd;
