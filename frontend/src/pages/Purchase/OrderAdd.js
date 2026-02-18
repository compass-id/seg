import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrderAdd = () => {
  // Fetches latest Order count for serie generation

  const [books, setBooks] = useState([]);

  const [orderData, setOrderData] = useState({
    serie: "",
    date: "",
    name: "",
    company: "Compass Publishing",
    email: "",
    phone: "081230398553",
    address:
      "Room No. 301 15-10, Gangnam Daero 39-Gil 06735 Seoul-Si Saecho-Gu, South Korea.",
    sales: "",
    bookList: [],
  });

  const handleReset = () => {
    setOrderData({
      ...orderData,

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

  // Generate series function
  const generateSerie = (count) => {
    // Update latestCount with the actual value
    const today = new Date();
    const month = today.getMonth() + 1; // Months are zero-indexed
    const year = today.getFullYear().toString().slice(-2);
    const formattedMonth = month.toString().padStart(2, "0");
    return `PO${count + 1 + 100}${formattedMonth}${year}`;
  };

  // setting up useNavigate
  const navigate = useNavigate();

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

  const AddOrder = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      // Remove the empty book object before sending to server
      const cleanedData = {
        ...orderData,
        bookList: orderData.bookList.filter(Boolean),
      };

      // Add the Order into database with axios
      await axios.post(`https://seg-server.vercel.app/api/orders`, cleanedData);

      // Navigate to main page
      navigate(`/orders`);
    } catch (error) {
      window.alert(error.message); // Display error message
    }
  };

  useEffect(() => {
    const fetchLatestCount = async () => {
      try {
        const url = `https://seg-server.vercel.app/api/orders`; // modify URL based on backend
        const datas = await axios.get(url);
        const currentMonth = new Date().getMonth();
        const res = datas.data;
        const filtered = res.filter((re) => {
          const dates = new Date(re.date);
          return dates.getMonth() === currentMonth;
        });
        const count = filtered.length;
        const serie = generateSerie(count);

        setOrderData({
          ...orderData,
          serie: serie,
        });
      } catch (error) {
        console.error("Error fetching latest Order count:", error);
      }
    };

    fetchLatestCount();

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
  }, []);

  return (
    <>
      <div className="section">
        <div className="section headline">
          <h4>Add Order</h4>
          <button onClick={() => navigate(`/orders`)} className="btn">
            See All Orders
          </button>
        </div>
        <div className="section">
          <form onSubmit={AddOrder} className="form">
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
};

export default OrderAdd;
