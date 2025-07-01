import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import * as XLSX from "xlsx";

function InvoiceEdit() {
  // Fetches latest invoice count for serie generation

  const [books, setBooks] = useState([]);

  const [invoiceData, setInvoiceData] = useState({
    serie: "",
    date: "",
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    sales: "",
    bookList: [],
  });

  // get id from parameter
  const { id } = useParams();

  // create Invoice deleter function
  const delInvoice = async () => {
    try {
      await axios.delete(`https://seg-server.vercel.app/api/invoices/id/${id}`); // modify URL based on backend
      // navigate to main page
      navigate(`/invoices`);
    } catch (error) {
      window.alert(error.message); // display error message
    }
  };

  // setting up useNavigate
  const navigate = useNavigate();

  const handleChange = (event) => {
    setInvoiceData({
      ...invoiceData,
      [event.target.name]: event.target.value,
    });
  };

  const handleBookChange = (index) => (event) => {
    const { name, value } = event.target;

    if (name === "isbn") {
      const selectedBook = books.find((book) => book.isbn === value);

      if (value === null || value === "" || value === "-") {
        setInvoiceData({
          ...invoiceData,
          bookList: invoiceData.bookList.map((book, i) =>
            index === i
              ? {
                  ...book,
                  [name]: value,
                }
              : book
          ),
        });
      } else if (selectedBook) {
        setInvoiceData({
          ...invoiceData,
          bookList: invoiceData.bookList.map((book, i) =>
            index === i
              ? {
                  ...book,

                  bookName: selectedBook.name,
                  isbn: selectedBook.isbn,
                  price: selectedBook.bookPrice,
                }
              : book
          ),
        });
      } else if (!selectedBook) {
        setInvoiceData({
          ...invoiceData,
          bookList: invoiceData.bookList.map((book, i) =>
            index === i
              ? {
                  ...book,
                  [name]: value,
                }
              : book
          ),
        });
      }
    } else {
      setInvoiceData({
        ...invoiceData,
        bookList: invoiceData.bookList.map((book, i) =>
          index === i
            ? {
                ...book,
                [name]: value,
              }
            : book
        ),
      });
    }
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    setInvoiceData({
      ...invoiceData,
      bookList: [
        ...invoiceData.bookList,
        { bookName: "", isbn: "", price: "", qty: "", disc: "" },
      ],
    });
  };

  const handleRemoveBook = (e) => {
    e.preventDefault();
    const lastBookIndex = invoiceData.bookList.length - 1;
    setInvoiceData({
      ...invoiceData,
      bookList: invoiceData.bookList.filter((book, i) => i !== lastBookIndex),
    });
  };

  const findBooks = (value, sample) => {
    const coded = String(value);
    const bookir = sample.find((book) => book.isbn === coded);
    return bookir?.name;
  };

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // 1. Parse the Excel file
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // 2. Get the first worksheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // 3. Convert to JSON with header row
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
        });

        // 4. Validate basic structure
        if (jsonData.length < 24) {
          throw new Error(
            "The Excel file doesn't match the expected format. Please use the correct template."
          );
        }

        // 5. Extract data with safety checks
        const getCellValue = (row, col) => {
          return jsonData[row]?.[col] || "";
        };

        // Customer information
        const customerName = getCellValue(6, 1);
        const invoiceNumber = getCellValue(4, 4);
        const invoiceDate = getCellValue(4, 6);
        const companyAddress = getCellValue(23, 0);
        const email = getCellValue(9, 1);
        const phone = getCellValue(11, 1);

        // Book data (rows 17-20)
        const bookList = [];
        for (let i = 17; i <= 20; i++) {
          const isbnBook = String(getCellValue(i, 2));
          const bookName =
            isbnBook === "" || isbnBook === "-"
              ? getCellValue(i, 1)
              : findBooks(isbnBook, books);

          if (isbnBook) {
            bookList.push({
              bookName,
              isbn: isbnBook,
              qty: getCellValue(i, 3),
              price: getCellValue(i, 4),
              disc: getCellValue(i, 5)
                ? (parseFloat(getCellValue(i, 5)) * 100).toString()
                : "",
            });
          }
        }

        // Format date (dd/mm/yyyy to yyyy-mm-dd)
        const formattedDate = (serial) => {
          // Check if input is a valid number
          if (typeof serial !== "number" || isNaN(serial) || serial < 1) {
            const [day, month, year] = serial.split("/");
            return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
          } else {
            // Excel date system considers 1900 as a leap year (incorrectly)
            const excelEpoch = new Date(1900, 0, 1);

            // Adjust for Excel's incorrect leap year assumption
            const offset = serial <= 60 ? serial - 1 : serial;

            // Calculate the date
            const date = new Date(excelEpoch);
            date.setDate(date.getDate() + offset - 1);

            // For serial numbers >= 60, we need to subtract 1 more day because Excel has an extra day (Feb 29, 1900)
            if (serial >= 60) {
              date.setDate(date.getDate() - 1);
            }

            // Format the date components
            const day = String(date.getDate() - 1).padStart(2, "0");
            const month = String(date.getMonth() + 2).padStart(2, "0");
            const year = date.getFullYear();

            return `${year}-${month}-${day}`;
          }
        };

        const invoiceDt = invoiceDate;
        const reformat = formattedDate(invoiceDt);

        // 6. Update state
        setInvoiceData({
          serie: invoiceNumber,
          date: reformat,
          name: customerName.split("-")[0]?.trim(),
          company: customerName.split("-")[1]?.trim(),
          email: email,
          phone: phone,
          address: companyAddress,
          bookList: [...bookList],
        });
      } catch (error) {
        console.error("Excel Import Error:", error);
        alert(
          `Import failed: ${error.message}\n\nPlease ensure you're using the correct template.`
        );
      }
    };

    reader.onerror = () => {
      alert("Error reading file. Please try again.");
    };

    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  // create Invoice update function
  const updInvoice = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      // Remove the empty book object before sending to server
      const cleanedData = {
        ...invoiceData,
        bookList: invoiceData.bookList.filter(Boolean),
      };

      // Add the Invoice into database with axios
      await axios.patch(
        `https://seg-server.vercel.app/api/invoices/id/${id}`,
        cleanedData
      );
      // Navigate to main page
      navigate(`/invoices`);
    } catch (error) {
      console.log(error); // display error message
    }
  };

  // setting up useEffect to do tasks in real-time
  useEffect(() => {
    // create Invoice loader callback function
    const getInvoiceById = async () => {
      try {
        // get all the datas from database with axios
        const res = await axios.get(
          `https://seg-server.vercel.app/api/invoices/id/${id}`
        );

        // input all the datas into useState
        setInvoiceData(res.data);
      } catch (error) {
        console.log(error); // display error message
      }
    };

    getInvoiceById();

    const getBooks = async () => {
      try {
        const url = `https://seg-server.vercel.app/api/books`; // modify URL based on backend
        const datas = await axios.get(url);
        setBooks(datas.data);
      } catch (error) {
        window.alert(error.message); // display error message
      }
    };

    getBooks();
  }, [id]);

  return (
    <>
      <div className="section">
        <div className="section headline">
          <h4>Edit Invoice</h4>
          <button onClick={() => navigate(`/invoices`)} className="btn">
            See All Invoices
          </button>
        </div>
        <div className="section">
          <form onSubmit={updInvoice} className="form">
            <div className="field">
              <label className="label">Import Xlsx</label>
              <input
                id="file-upload"
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileImport}
              />
            </div>
            <div className="field">
              <label className="label">No.</label>
              <input
                type="text"
                className="input"
                id="serie"
                name="serie"
                value={invoiceData.serie}
                onChange={handleChange}
                placeholder="No."
              />
            </div>
            <div className="field">
              <label className="label">Date</label>
              <input
                type="date"
                className="input"
                id="date"
                name="date"
                value={invoiceData.date}
                onChange={handleChange}
                placeholder="Date"
              />
            </div>
            <div className="field">
              <label className="label">PIC Name</label>
              <input
                type="text"
                className="input"
                id="name"
                name="name"
                value={invoiceData.name}
                onChange={handleChange}
                placeholder="PIC Name"
              />
            </div>
            <div className="field">
              <label className="label">Company</label>
              <input
                type="text"
                className="input"
                id="company"
                name="company"
                value={invoiceData.company}
                onChange={handleChange}
                placeholder="Company"
              />
            </div>
            <div className="field">
              <label className="label">Email</label>
              <input
                type="text"
                className="input"
                id="email"
                name="email"
                value={invoiceData.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </div>
            <div className="field">
              <label className="label">Phone</label>
              <input
                type="text"
                className="input"
                id="phone"
                name="phone"
                value={invoiceData.phone}
                onChange={handleChange}
                placeholder="Phone"
              />
            </div>
            <div className="field">
              <label className="label">Address</label>
              <input
                type="text"
                className="input"
                id="address"
                name="address"
                value={invoiceData.address}
                onChange={handleChange}
                placeholder="Address"
              />
            </div>
            <div className="field">
              <label className="label">Sales Name</label>
              <input
                type="text"
                className="input"
                id="sales"
                name="sales"
                value={invoiceData.sales}
                onChange={handleChange}
                placeholder="Sales Name"
              />
            </div>

            {invoiceData.bookList.map((book, index) => (
              <div className="section" key={index}>
                <div className="section">
                  <h4 className="label">Book {index + 1}</h4>
                </div>
                <div className="field">
                  <label className="label">Book Name</label>
                  {book.isbn === "-" ? (
                    <>
                      <input
                        type="text"
                        className="input"
                        id={`bame-${index}`}
                        name="bookName"
                        value={book.bookName}
                        onChange={handleBookChange(index)}
                        placeholder="Book Name"
                      />
                    </>
                  ) : (
                    <>
                      <select
                        type="text"
                        id={`hed-${index}`}
                        name={`isbn`}
                        value={book.isbn}
                        onChange={handleBookChange(index)}>
                        <option value="">--- Select Book ---</option>
                        <option value="-">[Custom Book Name]</option>
                        {books.map((item, i) => (
                          <option value={item.isbn}>{item.name}</option>
                        ))}
                      </select>
                    </>
                  )}
                </div>
                <div className="field">
                  <label className="label">ISBN</label>
                  <input
                    type="text"
                    id={`isbn-${index}`}
                    name={`isbn`}
                    value={book.isbn}
                    onChange={handleBookChange(index)}
                    placeholder={`ISBN`}
                  />
                </div>
                <div className="field">
                  <label className="label">Price</label>
                  <input
                    type="text"
                    id={`price-${index}`}
                    name={`price`}
                    value={book.price}
                    onChange={handleBookChange(index)}
                    placeholder={`Price`}
                  />
                </div>
                <div className="field">
                  <label className="label">Quantity</label>
                  <input
                    type="text"
                    id={`qty-${index}`}
                    name={`qty`}
                    value={book.qty}
                    onChange={handleBookChange(index)}
                    placeholder={`Quantity`}
                  />
                </div>
                <div className="field">
                  <label className="label">Discount</label>
                  <input
                    type="text"
                    id={`disc-${index}`}
                    name={`disc`}
                    value={book.disc}
                    onChange={handleBookChange(index)}
                    placeholder={`Discount`}
                  />
                </div>
              </div>
            ))}

            <div className="section">
              <div className="controls">
                <button
                  type="button"
                  className="btn"
                  onClick={handleRemoveBook}>
                  Remove Book
                </button>
                <button type="button" className="btn" onClick={handleAddBook}>
                  Add Book
                </button>
                <button type="button" className="btn" onClick={delInvoice}>
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

export default InvoiceEdit;
