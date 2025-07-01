// import dependencies
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

// create the main function
const BookEdit = () => {
  // create the useState
  const [name, setName] = useState("");
  const [isbn, setIsbn] = useState("");
  const [category, setCategory] = useState("");
  const [bookPrice, setBookPrice] = useState("");
  const [ebookPrice, setEbookPrice] = useState("");

  // get id from parameter
  const { id } = useParams();

  // setting up useNavigate
  const navigate = useNavigate();

  // create book deleter function
  const delBook = async () => {
    try {
      await axios.delete(`https://seg-server.vercel.app/api/books/id/${id}`); // modify URL based on backend
      // navigate to main page
      navigate(`/`);
    } catch (error) {
      window.alert(error.message); // display error message
    }
  };

  // create book update function
  const updBook = async () => {
    try {
      // send the inputs into database with axios
      await axios.patch(`https://seg-server.vercel.app/api/books/id/${id}`, {
        name,
        isbn,
        category,
        bookPrice,
        ebookPrice,
      });

      // navigate to main page
      navigate("/");
    } catch (error) {
      console.log(error); // display error message
    }
  };

  // setting up useEffect to do tasks in real-time
  useEffect(() => {
    // create book loader callback function
    const getBookById = async () => {
      try {
        // get all the datas from database with axios
        const res = await axios.get(
          `https://seg-server.vercel.app/api/books/id/${id}`
        );

        // input all the datas into useState
        setName(res.data.name);
        setIsbn(res.data.isbn);
        setCategory(res.data.category);
        setBookPrice(res.data.bookPrice);
        setEbookPrice(res.data.ebookPrice);
      } catch (error) {
        console.log(error); // display error message
      }
    };
    getBookById();
  }, [id]);

  // display input form to update the data
  return (
    <>
      <div className="section">
        <div className="section headline">
          <h4>Edit Book</h4>
          <button onClick={() => navigate(`/`)} className="btn">
            See All Books
          </button>
        </div>
        <div className="section">
          <form className="form">
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
                type="text"
                className="input"
                value={ebookPrice}
                onChange={(e) => setEbookPrice(e.target.value)}
                placeholder="E-Book Price"
              />
            </div>
            <div className="field">
              <div className="field-half"></div>
              <div className="controls">
                <button type="button" onClick={() => delBook()} className="btn">
                  Delete
                </button>
                <button type="button" onClick={() => updBook()} className="btn">
                  Update
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
export default BookEdit;
