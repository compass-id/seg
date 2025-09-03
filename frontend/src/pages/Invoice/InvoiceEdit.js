import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import * as XLSX from "xlsx";

function InvoiceEdit() {
  const [books, setBooks] = useState([]);

  const [invoiceData, setInvoiceData] = useState({
    serie: "",
    date: "", // This will hold the dd/mm/yyyy format for the input
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    sales: "",
    bookList: [],
  });

  const { id } = useParams();
  const navigate = useNavigate();

  const delInvoice = async () => {
    try {
      await axios.delete(`https://seg-server.vercel.app/api/invoices/id/${id}`);
      navigate(`/invoices`);
    } catch (error) {
      window.alert(error.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInvoiceData({
      ...invoiceData,
      [name]: value,
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
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
        });

        if (jsonData.length < 24) {
          throw new Error(
            "The Excel file doesn't match the expected format. Please use the correct template."
          );
        }

        const getCellValue = (row, col) => {
          return jsonData[row]?.[col] || "";
        };

        const customerName = getCellValue(6, 1);
        const invoiceNumber = getCellValue(4, 4);
        const invoiceDate = getCellValue(4, 6); // This will be in Excel's date format (number or string)
        const companyAddress = getCellValue(6, 3);
        const email = getCellValue(9, 1);
        const phone = getCellValue(11, 1);

        const bookList = [];
        let row = 17;
        while (true) {
          const hasGrandTotal = jsonData[row]?.some((cell) =>
            String(cell).includes("Grand Total (Rp.)")
          );

          if (hasGrandTotal) break;

          const isbnBook =
            getCellValue(row, 2) === "" ||
            getCellValue(row, 2) === null ||
            getCellValue(row, 2) === "-"
              ? "-"
              : String(getCellValue(row, 2));
          const qty = getCellValue(row, 3);
          const price = getCellValue(row, 4);
          const disc = getCellValue(row, 5);

          if (qty !== "" && price !== "") {
            const bookName =
              isbnBook === "-"
                ? getCellValue(row, 1)
                : findBooks(isbnBook, books);

            bookList.push({
              bookName,
              isbn: isbnBook,
              qty: qty,
              price: price,
              disc: disc ? (parseFloat(disc) * 100).toString() : "",
            });
          }
          row++;
        }

        // --- Start: Improved Excel Date to dd/mm/yyyy conversion ---
        let formattedInvoiceDate = "";
        formattedInvoiceDate = invoiceDate; // Already in dd/mm/yyyy format

        setInvoiceData({
          serie: invoiceNumber,
          date: formattedInvoiceDate, // Use the correctly formatted date
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

  const updInvoice = async (e) => {
    e.preventDefault();
    try {
      const cleanedData = {
        ...invoiceData,
        bookList: invoiceData.bookList.filter(Boolean),
      };

      await axios.patch(
        `https://seg-server.vercel.app/api/invoices/id/${id}`,
        cleanedData
      );
      navigate(`/invoices`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getInvoiceById = async () => {
      try {
        const res = await axios.get(
          `https://seg-server.vercel.app/api/invoices/id/${id}`
        );

        setInvoiceData({
          ...res.data, // Set the formatted date
        });
      } catch (error) {
        console.log(error);
      }
    };

    getInvoiceById();

    const getBooks = async () => {
      try {
        const url = `https://seg-server.vercel.app/api/books`;
        const datas = await axios.get(url);
        setBooks(datas.data);
      } catch (error) {
        window.alert(error.message);
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
                readOnly // Added readOnly as serie is likely generated
              />
            </div>
            <div className="field">
              <label className="label">Date</label>
              <input
                type="text"
                className="input"
                id="date"
                name="date"
                value={invoiceData.date}
                onChange={handleChange}
                placeholder="dd/mm/yyyy"
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
                          <option key={i} value={item.isbn}>
                            {item.name}
                          </option>
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
                    className="input"
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
                    className="input"
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
