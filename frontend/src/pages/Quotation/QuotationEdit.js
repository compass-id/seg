// import dependencies
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import * as XLSX from "xlsx";

// create the main function
const QuotationEdit = () => {
  const [books, setBooks] = useState([]);

  const [quotationData, setQuotationData] = useState({
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

  // setting up useNavigate
  const navigate = useNavigate();

  // create quotation deleter function
  const delquotation = async () => {
    try {
      await axios.delete(
        `https://seg-server.vercel.app/api/quotations/id/${id}`,
      ); // modify URL based on backend
      // navigate to main page
      navigate(`/quotations`);
    } catch (error) {
      window.alert(error.message); // display error message
    }
  };

  // create quotation update function
  const updQuotation = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      // Remove the empty book object before sending to server
      const cleanedData = {
        ...quotationData,
        bookList: quotationData.bookList.filter(Boolean),
      };

      // Add the quotation into database with axios
      await axios.patch(
        `https://seg-server.vercel.app/api/quotations/id/${id}`,
        cleanedData,
      );
      // Navigate to main page
      navigate(`/quotations`);
    } catch (error) {
      console.log(error); // display error message
    }
  };

  // setting up useEffect to do tasks in real-time
  useEffect(() => {
    // create quotation loader callback function
    const getQuotationById = async () => {
      try {
        // get all the datas from database with axios
        const res = await axios.get(
          `https://seg-server.vercel.app/api/quotations/id/${id}`,
        );

        // input all the datas into useState
        setQuotationData(res.data);
      } catch (error) {
        console.log(error); // display error message
      }
    };

    getQuotationById();

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

  useEffect(() => {
    const changeDeal = async () => {
      quotationData.bookList.forEach((item, index) => {
        const selectedBook = books.find((book) => book.isbn === item.isbn);

        if (
          item.isbn === null ||
          item.isbn === "" ||
          item.isbn === "-" ||
          item.bookName === ""
        ) {
          const bame = document.getElementById("bame-" + index);
          const hed = document.getElementById("hed-" + index);
          if (hed) hed.style = "display: none";
          if (bame) bame.style = "display: block";
        } else if (selectedBook) {
          const bame = document.getElementById("bame-" + index);
          const hed = document.getElementById("hed-" + index);
          if (hed) hed.style = "display: block";
          if (bame) bame.style = "display: none";
        } else if (!selectedBook) {
          const bame = document.getElementById("bame-" + index);
          const hed = document.getElementById("hed-" + index);
          if (hed) hed.style = "display: none";
          if (bame) bame.style = "display: block";
        }
      });
    };

    changeDeal();
  }, [books, quotationData]);

  const handleChange = (event) => {
    setQuotationData({
      ...quotationData,
      [event.target.name]: event.target.value,
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
            "The Excel file doesn't match the expected format. Please use the correct template.",
          );
        }

        const getCellValue = (row, col) => {
          return jsonData[row]?.[col] || "";
        };

        const customerName = getCellValue(6, 1);
        const invoiceNumber = getCellValue(4, 4);
        const invoiceDate = getCellValue(4, 6);
        const companyAddress = getCellValue(6, 3);
        const email = getCellValue(9, 1);
        const phone = getCellValue(11, 1);

        const bookList = [];
        let row = 17;
        while (true) {
          const hasGrandTotal = jsonData[row]?.some((cell) =>
            String(cell).includes("Grand Total (Rp.)"),
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

        // Format date to YYYY-MM-DD for the <input type="date">
        let formattedDate = "";
        if (typeof invoiceDate === "number") {
          const date = new Date(
            Math.round((invoiceDate - 25569) * 86400 * 1000),
          );
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          formattedDate = `${year}-${month}-${day}`;
        } else if (
          typeof invoiceDate === "string" &&
          invoiceDate.includes("/")
        ) {
          const parts = invoiceDate.split("/");
          if (parts.length === 3) {
            formattedDate = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
          } else {
            formattedDate = invoiceDate;
          }
        } else {
          formattedDate = invoiceDate;
        }

        setQuotationData((prev) => ({
          ...prev,
          serie: invoiceNumber,
          date: formattedDate,
          name: customerName.split("-")[0]?.trim() || "",
          company: customerName.split("-")[1]?.trim() || "",
          email: email,
          phone: phone,
          address: companyAddress,
          bookList: [...bookList],
        }));
      } catch (error) {
        console.error("Excel Import Error:", error);
        alert(
          `Import failed: ${error.message}\n\nPlease ensure you're using the correct template.`,
        );
      }
    };

    reader.onerror = () => {
      alert("Error reading file. Please try again.");
    };

    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  const handleBookChange = (index) => (event) => {
    const { name, value } = event.target;

    if (name === "isbn") {
      const selectedBook = books.find((book) => book.isbn === value);

      if (value === null || value === "" || value === "-") {
        const bame = document.getElementById("bame-" + index);
        const hed = document.getElementById("hed-" + index);
        if (hed) hed.style = "display: none";
        if (bame) bame.style = "display: block";

        setQuotationData({
          ...quotationData,
          bookList: quotationData.bookList.map((book, i) =>
            index === i
              ? {
                  ...book,
                  [name]: value,
                }
              : book,
          ),
        });
      } else if (selectedBook) {
        const bame = document.getElementById("bame-" + index);
        const hed = document.getElementById("hed-" + index);
        if (hed) hed.style = "display: block";
        if (bame) bame.style = "display: none";

        setQuotationData({
          ...quotationData,
          bookList: quotationData.bookList.map((book, i) =>
            index === i
              ? {
                  ...book,

                  bookName: selectedBook.name,
                  isbn: selectedBook.isbn,
                  price: selectedBook.bookPrice,
                }
              : book,
          ),
        });
      } else if (!selectedBook) {
        const bame = document.getElementById("bame-" + index);
        const hed = document.getElementById("hed-" + index);
        if (hed) hed.style = "display: none";
        if (bame) bame.style = "display: block";

        setQuotationData({
          ...quotationData,
          bookList: quotationData.bookList.map((book, i) =>
            index === i
              ? {
                  ...book,
                  [name]: value,
                }
              : book,
          ),
        });
      }
    } else {
      setQuotationData({
        ...quotationData,
        bookList: quotationData.bookList.map((book, i) =>
          index === i
            ? {
                ...book,
                [name]: value,
              }
            : book,
        ),
      });
    }
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    setQuotationData({
      ...quotationData,
      bookList: [
        ...quotationData.bookList,
        { bookName: "", isbn: "", price: "", qty: "", disc: "" },
      ],
    });
  };

  const handleRemoveBook = (e) => {
    e.preventDefault();
    const lastBookIndex = quotationData.bookList.length - 1;
    setQuotationData({
      ...quotationData,
      bookList: quotationData.bookList.filter((book, i) => i !== lastBookIndex),
    });
  };

  return (
    <>
      <div className="section">
        <div className="section headline">
          <h4>Edit Quotation</h4>
          <button onClick={() => navigate(`/quotations`)} className="btn">
            See All quotations
          </button>
        </div>
        <div className="section">
          <form onSubmit={updQuotation} className="form">
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
                value={quotationData.serie}
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
                value={quotationData.date}
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
                value={quotationData.name}
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
                value={quotationData.company}
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
                value={quotationData.email}
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
                value={quotationData.phone}
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
                value={quotationData.address}
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
                value={quotationData.sales}
                onChange={handleChange}
                placeholder="Sales Name"
              />
            </div>

            {quotationData.bookList.map((book, index) => (
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
                    <option value="-">[Custom Book Name]</option>
                    {books.map((item, i) => (
                      <option value={item.isbn}>{item.name}</option>
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
                <button type="button" onClick={delquotation} className="btn">
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
};

// export the main function
export default QuotationEdit;
