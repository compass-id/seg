// import dependencies
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// create the main function
const InvoiceList = () => {
  // create the useState
  const [invoices, setInvoices] = useState([]); // state for Invoice list
  const [searchs, setSearch] = useState(""); // state for search
  const [isLoading, setIsLoading] = useState(true); // state for loading
  const [isEmpty, setIsEmpty] = useState(false);
  const [filter, setFilter] = useState("");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });

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
    const getInvoices = async () => {
      try {
        if (!search) {
          const url = `https://seg-server.vercel.app/api/invoices`; // modify URL based on backend
          const datas = await axios.get(url); // get datas from URL with axios
          datas.data.length === 0 ? setIsEmpty(true) : setIsEmpty(false);

          const filterInvoicesByDateRange = (invoices, range) => {
            const now = new Date();
            return invoices.filter((invoice) => {
              const invoiceDate = new Date(invoice.date);
              switch (range) {
                case "":
                  return invoiceDate;
                case "today":
                  return invoiceDate.toDateString() === now.toDateString();
                case "week":
                  return now - invoiceDate < 7 * 24 * 60 * 60 * 1000;
                case "month":
                  return (
                    invoiceDate.getMonth() === now.getMonth() &&
                    invoiceDate.getFullYear() === now.getFullYear()
                  );
                case "lastMonth":
                  const lastMonthDate = new Date(
                    now.getFullYear(),
                    now.getMonth() - 1
                  );
                  return (
                    invoiceDate.getMonth() === lastMonthDate.getMonth() &&
                    invoiceDate.getFullYear() === lastMonthDate.getFullYear()
                  );
                case "threeMonths":
                  return now - invoiceDate < 90 * 24 * 60 * 60 * 1000;
                case "sixMonths":
                  return now - invoiceDate < 180 * 24 * 60 * 60 * 1000;
                case "twelveMonths":
                  return now - invoiceDate < 365 * 24 * 60 * 60 * 1000;
                case "year":
                  return invoiceDate.getFullYear() === now.getFullYear();
                case "lastYear":
                  return invoiceDate.getFullYear() === now.getFullYear() - 1;
                case "custom":
                  const { start, end } = customRange;
                  return (
                    invoiceDate >= new Date(start) &&
                    invoiceDate <= new Date(end)
                  );
                default:
                  return false;
              }
            });
          };

          const filteredInvoices = filterInvoicesByDateRange(
            datas.data,
            filter
          );

          setInvoices(filteredInvoices);
          setIsLoading(false);
        } else {
          const url = `https://seg-server.vercel.app/api/invoices/key/${search}`; // modify URL based on backend
          const datas = await axios.get(url); // get datas from URL with axios
          datas.data.length === 0 ? setIsEmpty(true) : setIsEmpty(false);

          const filterInvoicesByDateRange = (invoices, range) => {
            const now = new Date();
            return invoices.filter((invoice) => {
              const invoiceDate = new Date(invoice.date);
              switch (range) {
                case "":
                  return invoiceDate;
                case "today":
                  return invoiceDate.toDateString() === now.toDateString();
                case "week":
                  return now - invoiceDate < 7 * 24 * 60 * 60 * 1000;
                case "month":
                  return (
                    invoiceDate.getMonth() === now.getMonth() &&
                    invoiceDate.getFullYear() === now.getFullYear()
                  );
                case "lastMonth":
                  const lastMonthDate = new Date(
                    now.getFullYear(),
                    now.getMonth() - 1
                  );
                  return (
                    invoiceDate.getMonth() === lastMonthDate.getMonth() &&
                    invoiceDate.getFullYear() === lastMonthDate.getFullYear()
                  );
                case "threeMonths":
                  return now - invoiceDate < 90 * 24 * 60 * 60 * 1000;
                case "sixMonths":
                  return now - invoiceDate < 180 * 24 * 60 * 60 * 1000;
                case "twelveMonths":
                  return now - invoiceDate < 365 * 24 * 60 * 60 * 1000;
                case "year":
                  return invoiceDate.getFullYear() === now.getFullYear();
                case "lastYear":
                  return invoiceDate.getFullYear() === now.getFullYear() - 1;
                case "custom":
                  const { start, end } = customRange;
                  return (
                    invoiceDate >= new Date(start) &&
                    invoiceDate <= new Date(end)
                  );
                default:
                  return false;
              }
            });
          };

          const filteredInvoices = filterInvoicesByDateRange(
            datas.data,
            filter
          );

          setInvoices(filteredInvoices);
          setIsLoading(false);
        }
      } catch (error) {
        window.alert(error.message); // display error message
      }
    };

    getInvoices();
  }, [search, filter, customRange]); // dependency array with only `getInvoices`

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
        <h4>Invoice List</h4>
        <button onClick={() => navigate(`/invoice-add`)} className="btn">
          Add Invoice
        </button>
        <div className="section">
          <input
            type="text"
            className="input"
            value={searchs} // set value from search state
            onInput={(e) => setSearch(e.target.value)} // update search state on change
            placeholder="Search Invoices..."
          />
        </div>

        <p>Ditemukan: {invoices.length} data</p>
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
      <div className="section">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="lastMonth">Last 1 Month</option>
          <option value="threeMonths">Last 3 Months</option>
          <option value="sixMonths">Last 6 Months</option>
          <option value="twelveMonths">Last 12 Months</option>
          <option value="year">This Year</option>
          <option value="lastYear">Last Year</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>
      {filter === "custom" && (
        <div className="date-range-container section">
          <input
            type="date"
            value={customRange.start}
            onChange={(e) =>
              setCustomRange({ ...customRange, start: e.target.value })
            }
          />
          <span>to</span>
          <input
            type="date"
            value={customRange.end}
            onChange={(e) =>
              setCustomRange({ ...customRange, end: e.target.value })
            }
          />
        </div>
      )}
      <hr />
      {isLoading ? (
        <div className="section">Loading Invoice Database...</div> // display status when loading
      ) : isEmpty ? (
        <div className="section">No data...</div> // display status when loading
      ) : (
        // display table after loading
        <div className="section">
          {invoices.map((invoice, index) => (
            <div className="section" key={index}>
              <div className="card">
                <div className="card black">
                  <div className="section">
                    {!invoice.serie ? (
                      <></>
                    ) : (
                      <p>
                        <span>No. : </span>
                        {invoice.serie}
                      </p>
                    )}
                    <p>
                      <span>Date : </span>
                      {formatDate(invoice.date)}
                    </p>
                    <p>
                      <button
                        className="btn"
                        onClick={() =>
                          (window.location.href = `https://github.com/competech-id/docs/raw/master/Invoice/${invoice.serie}.xlsx`)
                        }
                        download
                      >
                        GET XLSX
                      </button>
                      <button
                        className="btn"
                        onClick={() => navigate(`/invoice-edit/${invoice._id}`)}
                      >
                        EDIT
                      </button>
                    </p>
                  </div>
                </div>
                <div className="card">
                  <div className="section">
                    {!invoice.name ? (
                      <></>
                    ) : (
                      <p>
                        <span>Name : </span>
                        {invoice.name}
                      </p>
                    )}
                    {!invoice.company ? (
                      <></>
                    ) : (
                      <p>
                        <span>Company : </span>
                        {invoice.company}
                      </p>
                    )}
                    {!invoice.address ? (
                      <></>
                    ) : (
                      <p>
                        <span>Address : </span>
                        {invoice.address}
                      </p>
                    )}
                    {!invoice.phone ? (
                      <></>
                    ) : (
                      <p>
                        <span>Phone : </span>
                        <a href={`tel:${invoice.phone}`}>{invoice.phone}</a>
                      </p>
                    )}
                    {!invoice.email ? (
                      <></>
                    ) : (
                      <p>
                        <span>Email : </span>
                        <a href={`mailto:${invoice.email.toLowerCase()}`}>
                          {invoice.email.toLowerCase()}
                        </a>
                      </p>
                    )}
                    <p>
                      <span>Total Amount : </span>
                      {formatCurrency(
                        invoice.bookList.reduce(
                          (sum, book) =>
                            sum +
                            (book.price - book.price * (book.disc / 100)) *
                              book.qty,
                          0
                        )
                      )}
                    </p>
                    {!invoice.sales ? (
                      <></>
                    ) : (
                      <p>
                        <span>Sales : </span>
                        {invoice.sales}
                      </p>
                    )}
                  </div>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>ISBN</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Discount</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.bookList.map((book, index) => (
                      <tr key={index}>
                        <td>{book.bookName}</td>
                        <td>{book.isbn}</td>
                        <td>{book.qty}</td>
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
export default InvoiceList;
