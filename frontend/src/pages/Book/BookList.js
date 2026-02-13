// import dependencies
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

// create the main function
const BookList = () => {
  // create the useState
  const [books, setBooks] = useState([]); // state for book list
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

  // dependency array with only `search`

  // setting up useEffect to do tasks in real-time
  useEffect(() => {
    // create book loader callback function
    const getBooks = async () => {
      try {
        if (!search) {
          const url = `https://seg-server.vercel.app/api/books`; // modify URL based on backend
          const datas = await axios.get(url); // get datas from URL with axios
          datas.data.length === 0 ? setIsEmpty(true) : setIsEmpty(false);
          setIsLoading(false);
          setBooks(datas.data);
        } else {
          const url = `https://seg-server.vercel.app/api/books/key/${search}`; // modify URL based on backend
          const datas = await axios.get(url); // get datas from URL with axios
          datas.data.length === 0 ? setIsEmpty(true) : setIsEmpty(false);
          setIsLoading(false);
          setBooks(datas.data);
        }
      } catch (error) {
        window.alert(error.message); // display error message
      }
    };

    getBooks();
  }, [search]); // dependency array with only `getBooks`

  // render the display
  return (
    <>
      <div className="section headline">
        <h4>Book List</h4>
        <button onClick={() => navigate(`/book-add`)} className="btn">
          Add Book
        </button>
        <div className="section">
          <input
            type="text"
            className="input"
            value={searchs} // set value from search state
            onInput={(e) => setSearch(e.target.value)} // update search state on change
            placeholder="Search Books..."
          />
        </div>
        <p>Ditemukan: {books.length} data</p>
      </div>
      {isLoading ? (
        <div className="section">Loading Book Database...</div> // display status when loading
      ) : isEmpty ? (
        <div className="section">No data...</div> // display status when loading
      ) : (
        // display table after loading

        <div>
          <table className="table frame">
            <thead>
              <tr>
                <th>No.</th>
                <th>Book Name</th>
                <th>ISBN</th>
                <th>Category</th>
                <th>Book Price</th>
                <th>E-Book Price</th>
                <th>Added At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {books.map((Book, index) => (
                // table content
                <tr key={Book._id}>
                  <td>{index + 1}</td>
                  <td>{Book.name}</td>
                  <td>{Book.isbn}</td>
                  <td>{Book.category}</td>
                  <td>{formatCurrency(Book.bookPrice)}</td>
                  <td>{formatCurrency(Book.ebookPrice)}</td>
                  <td>
                    {formatDistanceToNow(new Date(Book.createdAt), {
                      addSuffix: true,
                    })}
                  </td>
                  <td>
                    <button
                      onClick={() => navigate(`/book-edit/${Book._id}`)}
                      className="btn"
                    >
                      Edit Book
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

// export the main function
export default BookList;
