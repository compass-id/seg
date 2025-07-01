// import router kit
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  BookAdd,
  BookEdit,
  BookList,
  InvoiceAdd,
  InvoiceEdit,
  InvoiceList,
  OrderAdd,
  OrderEdit,
  OrderList,
  QuotationAdd,
  QuotationEdit,
  QuotationList,
  Login,
  EventAdd,
  EventEdit,
  EventList,
  EventView,
  EventPartyEdit,
  EventPartyList,
  PostAdd,
  PostList,
  PostEnView,
  PostIdView,
  PostEnEdit,
  PostIdEdit,
  Stat,
} from "./pages";
import { Navigation } from "./components";
import Cookies from "js-cookie";

const App = () => {
  const [isLogin, setIsLogin] = useState();

  useEffect(() => {
    const getLogin = async () => {
      const logged = Cookies.get("isLogin");
      logged !== undefined ? setIsLogin(true) : setIsLogin(false);
    };
    getLogin();
  }, [isLogin]);

  return (
    <>
      {isLogin === true ? (
        <Router>
          <Navigation />
          <div className="main-page">
            <Routes>
              <Route path="/" element={<Stat />} />
              <Route path="/books" element={<BookList />} />
              <Route path="/book-add" element={<BookAdd />} />
              <Route path="/book-edit/:id" element={<BookEdit />} />
              <Route path="/invoices" element={<InvoiceList />} />
              <Route path="/invoice-add" element={<InvoiceAdd />} />
              <Route path="/invoice-edit/:id" element={<InvoiceEdit />} />
              <Route path="/quotations" element={<QuotationList />} />
              <Route path="/quotation-add" element={<QuotationAdd />} />
              <Route path="/quotation-edit/:id" element={<QuotationEdit />} />
              <Route path="/orders" element={<OrderList />} />
              <Route path="/order-add" element={<OrderAdd />} />
              <Route path="/order-edit/:id" element={<OrderEdit />} />
              <Route path="/posts" element={<PostList />} />
              <Route path="/post-add" element={<PostAdd />} />
              <Route path="/post-edit/en/:id" element={<PostEnEdit />} />
              <Route path="/post-edit/id/:id" element={<PostIdEdit />} />
              <Route path="/post-view/en/:id" element={<PostEnView />} />
              <Route path="/post-view/id/:id" element={<PostIdView />} />
              <Route path="/events" element={<EventList />} />
              <Route path="/event-add" element={<EventAdd />} />
              <Route path="/event-edit/:id" element={<EventEdit />} />
              <Route path="/event-view/:id" element={<EventView />} />
              <Route path="/event-join-list/:id" element={<EventPartyList />} />
              <Route path="/event-join-edit/:id" element={<EventPartyEdit />} />
              <Route path="/stats" element={<Stat />} />
            </Routes>
          </div>
        </Router>
      ) : (
        <Router>
          <Navigation />
          <div className="main-page">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/admin-login" element={<Login />} />
            </Routes>
          </div>
        </Router>
      )}
    </>
  );
};

export default App;
