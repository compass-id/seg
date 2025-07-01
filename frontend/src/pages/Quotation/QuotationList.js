// import dependencies
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// create the main function
const QuotationList = () => {
  // create the useState
  const [quotations, setQuotations] = useState([]); // state for Quotation list
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
    const getQuotations = async () => {
      try {
        if (!search) {
          const url = `https://seg-server.vercel.app/api/quotations`; // modify URL based on backend
          const datas = await axios.get(url); // get datas from URL with axios
          datas.data.length === 0 ? setIsEmpty(true) : setIsEmpty(false);
          setQuotations(datas.data);
          setIsLoading(false);
        } else {
          const url = `https://seg-server.vercel.app/api/quotations/key/${search}`; // modify URL based on backend
          const datas = await axios.get(url); // get datas from URL with axios
          datas.data.length === 0 ? setIsEmpty(true) : setIsEmpty(false);
          setQuotations(datas.data);
          setIsLoading(false);
        }
      } catch (error) {
        window.alert(error.message); // display error message
      }
    };
    getQuotations();
  }, [search]); // dependency array with only `getQuotations`

  function formatDate(dateString) {
    // Create a new Date object from the input string
    const date = new Date(dateString);

    // Get the year, month (0-indexed), and day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero for single-digit months
    const day = String(date.getDate()).padStart(2, "0"); // Add leading zero for single-digit days

    // Format the date in the desired format
    return `${day}/${month}/${year}`;
  }

  const salesSet = (a, b, c, d) => {
    if (a !== "All") {
      setSearch(a);
    } else {
      setSearch("");
    }

    document.getElementById(a).classList.add("active");
    document.getElementById(b).classList.remove("active");
    document.getElementById(c).classList.remove("active");
    document.getElementById(d).classList.remove("active");
  };

  // render the display
  return (
    <>
      <div className="section headline">
        <h4>Quotation List</h4>
        <button onClick={() => navigate(`/quotation-add`)} className="btn">
          Add Quotation
        </button>
        <div className="section">
          <input
            type="text"
            className="input"
            value={searchs} // set value from search state
            onInput={(e) => setSearch(e.target.value)} // update search state on change
            placeholder="Search quotations..."
          />
        </div>
        <p>Ditemukan: {quotations.length} data</p>
      </div>
      <div className="section lang">
        <button
          type="button"
          onClick={() => salesSet("All", "Cahyo", "Tulus", "Angga")}
          id="All"
          className="active"
        >
          All
        </button>
        <button
          type="button"
          onClick={() => salesSet("Angga", "Cahyo", "Tulus", "All")}
          id="Angga"
        >
          Angga
        </button>
        <button
          type="button"
          onClick={() => salesSet("Cahyo", "Angga", "Tulus", "All")}
          id="Cahyo"
        >
          Cahyo
        </button>
        <button
          type="button"
          onClick={() => salesSet("Tulus", "Cahyo", "Angga", "All")}
          id="Tulus"
        >
          Tulus
        </button>
      </div>
      {isLoading ? (
        <div className="section">Loading Quotation Database...</div> // display status when loading
      ) : isEmpty ? (
        <div className="section">No data...</div> // display status when loading
      ) : (
        // display table after loading
        <div className="section">
          {quotations.map((quotation, index) => (
            <div className="section" key={index}>
              <div className="card">
                <div className="card black">
                  <div className="section">
                    {!quotation.serie ? (
                      <></>
                    ) : (
                      <p>
                        <span>No. : </span>
                        {quotation.serie}
                      </p>
                    )}
                    <p>
                      <span>Date : </span>
                      {formatDate(quotation.date)}
                    </p>
                    <p>
                      <button
                        className="btn"
                        onClick={() =>
                          (window.location.href = `https://github.com/competech-id/docs/raw/master/Quotation/${quotation.serie}.xlsx`)
                        }
                        download
                      >
                        GET XLSX
                      </button>
                      <button
                        className="btn"
                        onClick={() =>
                          navigate(`/quotation-edit/${quotation._id}`)
                        }
                      >
                        EDIT
                      </button>
                    </p>
                  </div>
                </div>
                <div className="card">
                  <div className="section">
                    {!quotation.name ? (
                      <></>
                    ) : (
                      <p>
                        <span>Name : </span>
                        {quotation.name}
                      </p>
                    )}
                    {!quotation.company ? (
                      <></>
                    ) : (
                      <p>
                        <span>Company : </span>
                        {quotation.company}
                      </p>
                    )}
                    {!quotation.address ? (
                      <></>
                    ) : (
                      <p>
                        <span>Address : </span>
                        {quotation.address}
                      </p>
                    )}
                    {!quotation.phone ? (
                      <></>
                    ) : (
                      <p>
                        <span>Phone : </span>
                        <a href={`tel:${quotation.phone}`}>{quotation.phone}</a>
                      </p>
                    )}
                    {!quotation.email ? (
                      <></>
                    ) : (
                      <p>
                        <span>Email : </span>
                        <a href={`mailto:${quotation.email.toLowerCase()}`}>
                          {quotation.email.toLowerCase()}
                        </a>
                      </p>
                    )}
                    <p>
                      <span>Total Amount : </span>
                      {formatCurrency(
                        quotation.bookList.reduce(
                          (sum, book) =>
                            sum +
                            (book.price - book.price * (book.disc / 100)) *
                              book.qty,
                          0
                        )
                      )}
                    </p>
                    {!quotation.sales ? (
                      <></>
                    ) : (
                      <p>
                        <span>Sales : </span>
                        {quotation.sales}
                      </p>
                    )}
                  </div>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>ISBN</th>
                      <th>Price</th>
                      <th>Discount</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotation.bookList.map((book, index) => (
                      <tr key={index}>
                        <td>{book.bookName}</td>
                        <td>{book.isbn}</td>
                        <td>{formatCurrency(book.price)}</td>
                        <td>{book.disc > 0 ? book.disc + "%" : ""}</td>
                        <td>
                          {formatCurrency(
                            book.price * book.qty -
                              book.price * book.qty * (book.disc / 100)
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

// export the main function
export default QuotationList;
