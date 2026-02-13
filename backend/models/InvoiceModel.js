// import dependencies
import mongoose from "mongoose";
import xlsx from "xlsx";

// create a schema
const invSchema = mongoose.Schema(
  {
    serie: {
      type: String,
    },
    date: {
      type: String,
    },
    name: {
      type: String,
    },
    company: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    sales: {
      type: String,
    },
    bookList: [
      {
        bookName: {
          type: String,
        },
        isbn: {
          type: String,
        },
        price: {
          type: String,
        },
        qty: {
          type: String,
        },
        disc: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// export the schema
const Invoice = mongoose.model("Invoice", invSchema);
export default Invoice;

export const exportSalesData = async () => {
  // Ambil data dari MongoDB, urutkan berdasarkan sales dan date
  const invoices = await Invoice.find().sort({ sales: 1, date: 1 });

  // Proses data untuk format XLSX
  const rows = [];
  invoices.forEach((invoice) => {
    const totals = [];
    totals[invoice] = { totalPrice: 0, totalQty: 0 };
    invoice.bookList.forEach((book) => {
      const price = parseFloat(book.price || 0);
      const qty = parseInt(book.qty || 0, 10);
      const disc = parseFloat(book.disc || 0);

      const discount = disc / 100;
      const prices = price * discount;
      const amount = price - prices;
      const totali = amount * qty;

      rows.push({
        Date: invoice.date,
        Serie: invoice.serie,
        Sales: invoice.sales,
        Company: invoice.company,
        PIC: invoice.name,
        BookName: book.bookName,
        ISBN: book.isbn,
        Price: book.price,
        Quantity: book.qty,
        Discount: book.disc,
        Total: totali,
      });
    });
  });

  // Buat file XLSX
  const worksheet = xlsx.utils.json_to_sheet(rows);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Sales Data");

  // Simpan file XLSX
  xlsx.writeFile(workbook, "SalesData.xlsx");

  console.log("Data berhasil diekspor ke SalesData.xlsx");
};

exportSalesData().catch((err) => console.error(err));
