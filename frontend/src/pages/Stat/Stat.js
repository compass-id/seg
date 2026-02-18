import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "./Stat.css";

const Stat = () => {
  const [filteredData, setFilteredData] = useState({});
  const [filter, setFilter] = useState("");
  const [bestSellingBooks, setBestSellingBooks] = useState([]);
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState([]);

  const formatCurrency = (number) => {
    const options = {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };
    return new Intl.NumberFormat("id-ID", options).format(number);
  };

  const calculateGrandTotals = () => {
    const grandTotalSales = salesNames.reduce(
      (acc, name) => acc + filteredData[name].totalSales,
      0
    );
    const grandTotalQty = salesNames.reduce(
      (acc, name) => acc + filteredData[name].totalQty,
      0
    );
    return { grandTotalSales, grandTotalQty };
  };

  const calculateTotalsBySales = (invoices, allSalesNames) => {
    const totals = {};
    allSalesNames.forEach((sales) => {
      totals[sales] = { totalSales: 0, totalQty: 0 };
    });

    invoices.forEach((invoice) => {
      invoice.bookList.forEach((book) => {
        const price = parseFloat(book.price);
        const qty = parseInt(book.qty, 10);
        const disc = parseFloat(book.disc) / 100 || 0;
        totals[invoice.sales].totalSales += (price - price * disc) * qty;
        totals[invoice.sales].totalQty += qty;
      });
    });

    return totals;
  };

  const calculateBestSellingBooks = (invoices) => {
    const bookSales = {};
    invoices.forEach((invoice) => {
      invoice.bookList.forEach((book) => {
        const bookName = book.bookName;
        const price = parseFloat(book.price);
        const qty = parseInt(book.qty, 10);
        const disc = parseFloat(book.disc) / 100 || 0;
        const totalPrice = (price - price * disc) * qty;
        if (!bookSales[bookName]) {
          bookSales[bookName] = { totalPrice: 0, qty: 0, sales: invoice.sales };
        }
        bookSales[bookName].totalPrice += totalPrice;
        bookSales[bookName].qty += qty;
      });
    });
    return Object.entries(bookSales)
      .sort((a, b) => b[1].qty - a[1].qty)
      .slice(0, 10000);
  };

  useEffect(() => {
    const getInvoices = async () => {
      try {
        const url = `https://seg-server.vercel.app/api/invoices`;
        const response = await axios.get(url);

        // Get all unique sales names from the invoices
        const allSalesNames = new Set(
          response.data.map((invoice) => invoice.sales)
        );

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
                  invoiceDate >= new Date(start) && invoiceDate <= new Date(end)
                );
              default:
                return false;
            }
          });
        };

        const filteredInvoices = filterInvoicesByDateRange(
          response.data,
          filter
        );
        const totals = calculateTotalsBySales(filteredInvoices, allSalesNames);

        // Ensure all sales names are in the totals object, even if they have no sales
        const completeTotals = {};
        allSalesNames.forEach((sales) => {
          completeTotals[sales] = totals[sales] || {
            totalSales: 0,
            totalQty: 0,
          };
        });

        setFilteredData(completeTotals);
        setBestSellingBooks(calculateBestSellingBooks(filteredInvoices));

        const fetchData = async (key) => {
          const [invoices, quotations, orders] = await Promise.all([
            axios.get(`https://seg-server.vercel.app/api/invoices/key/${key}`),
            axios.get(
              `https://seg-server.vercel.app/api/quotations/key/${key}`
            ),
            axios.get(`https://seg-server.vercel.app/api/orders/key/${key}`),
          ]);
          return {
            saled: key,
            invoice: invoices.data.length,
            quotation: quotations.data.length,
            po: orders.data.length,
          };
        };

        const getBrad = async () => {
          const keys = ["Angga", "Cahyo", "Tulus"];
          const results = await Promise.all(keys.map(fetchData));
          setStats(results);
          setIsLoading(false);
        };

        getBrad();
      } catch (error) {
        window.alert(error.message);
      }
    };

    getInvoices();
  }, [filter, customRange]);

  const salesNames = Object.keys(filteredData);
  const { grandTotalSales, grandTotalQty } = calculateGrandTotals();

  const chartData = {
    labels: salesNames,
    datasets: [
      {
        label: "Total Sales",
        data: salesNames.map((name) => filteredData[name].totalSales),
        fill: false,
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <>
      <div className="section container">
        <h4>Total Sales Insight</h4>
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
        {isLoading === false ? (
          <>
            <div className="section">
              <div className="chart-container">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
            <div className="section">
              <table className="sales-table">
                <thead>
                  <tr>
                    <th>Sales Name</th>
                    <th>Total Sales</th>
                    <th>Total Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {salesNames.map((name, index) => (
                    <>
                      <tr key={index}>
                        <td>{name}</td>
                        <td>{formatCurrency(filteredData[name].totalSales)}</td>
                        <td>{filteredData[name].totalQty} cps</td>
                      </tr>
                    </>
                  ))}
                  <tr>
                    <th>Grand Total</th>
                    <td>{formatCurrency(grandTotalSales)}</td>
                    <td>{grandTotalQty} cps</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="section"></div>
            <div className="section">
              <h4>Statistic</h4>
            </div>
            <hr />
            <div className="section">
              <table className="books-table">
                <thead>
                  <tr>
                    <th>Sales Name</th>
                    <th>Total Invoice</th>
                    <th>Total Quotation</th>
                    <th>Total PO</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((item, index) => (
                    <tr key={index}>
                      <td>{item.saled}</td>
                      <td>{item.invoice}</td>
                      <td>{item.quotation}</td>
                      <td>{item.po}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="section"></div>
            <div className="section">
              <h4>Books Sold</h4>
            </div>
            <hr />
            <div className="section">
              <table className="books-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Book Name</th>
                    <th>Total Price</th>
                    <th>Total Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {bestSellingBooks.length > 0 ? (
                    bestSellingBooks.map(([bookName, data], index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{bookName}</td>
                        <td>{formatCurrency(data.totalPrice)}</td>
                        <td>{data.qty} cps</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <div className="section">Loading revenue database...</div>
          </>
        )}
      </div>
      <div className="section"></div>
    </>
  );
};

export default Stat;
