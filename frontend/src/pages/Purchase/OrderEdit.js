// import dependencies
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

// create the main function
const OrderEdit = () => {
  const [books, setBooks] = useState([]);

  const [orderData, setOrderData] = useState({
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

  // create Invoice deleter function
  const delInvoice = async () => {
    try {
      await axios.delete(`https://seg-server.vercel.app/api/orders/id/${id}`); // modify URL based on backend
      // navigate to main page
      navigate(`/orders`);
    } catch (error) {
      window.alert(error.message); // display error message
    }
  };

  // create Invoice update function
  const updOrder = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      // Remove the empty book object before sending to server
      const cleanedData = {
        ...orderData,
        bookList: orderData.bookList.filter(Boolean),
      };

      // Add the Invoice into database with axios
      await axios.patch(
        `https://seg-server.vercel.app/api/orders/id/${id}`,
        cleanedData
      );
      // Navigate to main page
      navigate(`/orders`);
    } catch (error) {
      console.log(error); // display error message
    }
  };

  // setting up useEffect to do tasks in real-time
  useEffect(() => {
    // create Invoice loader callback function
    const getOrderById = async () => {
      try {
        // get all the datas from database with axios
        const res = await axios.get(
          `https://seg-server.vercel.app/api/orders/id/${id}`
        );

        // input all the datas into useState
        setOrderData(res.data);
      } catch (error) {
        console.log(error); // display error message
      }
    };

    getOrderById();

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
      orderData.bookList.forEach((item, index) => {
        const selectedBook = books.find((book) => book.isbn === item.isbn);

        if (
          item.isbn === null ||
          item.isbn === "" ||
          item.isbn === "-" ||
          item.bookName === ""
        ) {
          const bame = document.getElementById("bame-" + index);
          const hed = document.getElementById("hed-" + index);
          hed.style = "display: none";
          bame.style = "display: block";
        } else if (selectedBook) {
          const bame = document.getElementById("bame-" + index);
          const hed = document.getElementById("hed-" + index);
          hed.style = "display: block";
          bame.style = "display: none";
        } else if (!selectedBook) {
          const bame = document.getElementById("bame-" + index);
          const hed = document.getElementById("hed-" + index);
          hed.style = "display: none";
          bame.style = "display: block";
        }
      });
    };

    changeDeal();
  }, [books, orderData]);

  const handleChange = (event) => {
    setOrderData({
      ...orderData,
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

        setOrderData({
          ...orderData,
          bookList: orderData.bookList.map((book, i) =>
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

        setOrderData({
          ...orderData,
          bookList: orderData.bookList.map((book, i) =>
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

        setOrderData({
          ...orderData,
          bookList: orderData.bookList.map((book, i) =>
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
      setOrderData({
        ...orderData,
        bookList: orderData.bookList.map((book, i) =>
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
    setOrderData({
      ...orderData,
      bookList: [
        ...orderData.bookList,
        { bookName: "", isbn: "", price: "", qty: "", disc: "" },
      ],
    });
  };

  const handleRemoveBook = (e) => {
    e.preventDefault();
    const lastBookIndex = orderData.bookList.length - 1;
    setOrderData({
      ...orderData,
      bookList: orderData.bookList.filter((book, i) => i !== lastBookIndex),
    });
  };

  return (
    <>
      <div className="section">
        <div className="section headline">
          <h4>Add Invoice</h4>
          <button onClick={() => navigate(`/orders`)} className="btn">
            See All Invoices
          </button>
        </div>
        <div className="section">
          <form onSubmit={updOrder} className="form">
            <div className="field">
              <label className="label">No.</label>
              <input
                type="text"
                className="input"
                id="serie"
                name="serie"
                value={orderData.serie}
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
                value={orderData.date}
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
                value={orderData.name}
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
                value={orderData.company}
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
                value={orderData.email}
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
                value={orderData.phone}
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
                value={orderData.address}
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
                value={orderData.sales}
                onChange={handleChange}
                placeholder="Sales Name"
              />
            </div>

            {orderData.bookList.map((book, index) => (
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
                    onChange={handleBookChange(index)}
                  >
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
                  onClick={handleRemoveBook}
                >
                  Remove Book
                </button>
                <button type="button" className="btn" onClick={handleAddBook}>
                  Add Book
                </button>
                <button type="button" onClick={delInvoice} className="btn">
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
export default OrderEdit;
