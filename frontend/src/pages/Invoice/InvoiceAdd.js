import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

function InvoiceAdd() {
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

  const handleReset = () => {
    setInvoiceData({
      ...invoiceData,
      date: "",
      name: "",
      company: "",
      email: "",
      phone: "",
      address: "",
      sales: "",
      bookList: [],
    });
  };

  const generateSerie = (count) => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear().toString().slice(-2);
    const formattedMonth = month.toString().padStart(2, "0");
    return `COM${count + 1 + 100}${formattedMonth}${year}`;
  };

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
        const bame = document.getElementById("bame-" + index);
        const hed = document.getElementById("hed-" + index);
        hed.style = "display: none";
        bame.style = "display: block";

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
        const bame = document.getElementById("bame-" + index);
        const hed = document.getElementById("hed-" + index);
        hed.style = "display: block";
        bame.style = "display: none";

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
        const bame = document.getElementById("bame-" + index);
        const hed = document.getElementById("hed-" + index);
        hed.style = "display: none";
        bame.style = "display: block";

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

        // Book data - find all rows from row 17 until "Grand Total (Rp.)" is found
        const bookList = [];
        let row = 17;
        while (true) {
          // Check if current row contains "Grand Total (Rp.)"
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

          // Skip empty rows (where all relevant fields are empty)
          if (isbnBook || qty || price || disc) {
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
            const day = String(date.getDate() - 3).padStart(2, "0");
            const month = String(date.getMonth() + 4).padStart(2, "0");
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

  const AddInvoice = async (e) => {
    e.preventDefault();
    try {
      const cleanedData = {
        ...invoiceData,
        bookList: invoiceData.bookList.filter(Boolean),
      };

      await axios.post(
        `https://seg-server.vercel.app/api/Invoices`,
        cleanedData
      );

      navigate(`/invoices`);
    } catch (error) {
      window.alert(error.message);
    }
  };

  useEffect(() => {
    const fetchLatestCount = async () => {
      try {
        const url = `https://seg-server.vercel.app/api/invoices`;
        const datas = await axios.get(url);
        const currentMonth = new Date().getMonth();
        const res = datas.data;
        const filtered = res.filter((re) => {
          const dates = new Date(re.date);
          return dates.getMonth() === currentMonth;
        });
        const count = filtered.length;
        const serie = generateSerie(count);

        setInvoiceData({
          ...invoiceData,
          serie: serie,
        });
      } catch (error) {
        console.error("Error fetching latest invoice count:", error);
      }
    };
    fetchLatestCount();

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
  }, []);

  return (
    <>
      <div className="section">
        <div className="section headline">
          <h4>Add Invoice</h4>
          <div>
            <button onClick={() => navigate(`/invoices`)} className="btn">
              See All Invoices
            </button>
          </div>
        </div>
        <div className="section">
          <form onSubmit={AddInvoice} className="form">
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
                  <select
                    type="text"
                    id={`hed-${index}`}
                    name={`isbn`}
                    value={book.isbn}
                    onChange={handleBookChange(index)}>
                    <option value="">--- Select Book ---</option>
                    <option value="-">{book.bookName}</option>
                    {books.map((item, i) => (
                      <option key={i} value={item.isbn}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    className="input"
                    id={`bame-${index}`}
                    name="bookName"
                    style={{ display: "none" }}
                    value={book.bookName}
                    onChange={handleBookChange(index)}
                    placeholder="Book Name"
                  />
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

export default InvoiceAdd;
