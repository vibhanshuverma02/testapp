"use client";
import React from "react";
import InvoicePDF from "@/components/PDF";

interface InvoicePDFWrapperProps {
  invoiceNo: string;
  date: string;
  customerName: string;
  mobileNo: string;
  customer_gst: string;
 salesperson:string
  items: {
    itemName: string;
    hsn: string;
    rate: number;
    quantity: number;
    gstRate: number;
  }[];
  Grandtotal: number;
  gstTotal: number;
  previousBalance: number;
  paidAmount: number;
  balanceDue: number | null;
  paymentStatus: string | null;
  Goodsreturn: number |null;
}

const ITEM_THRESHOLD = 12;

const InvoicePDFWrapper = (props: InvoicePDFWrapperProps) => {
  const {
    items,
    invoiceNo,
    date,
    customerName,
    mobileNo,
    salesperson,
    Grandtotal,
    gstTotal,
    Goodsreturn,
    customer_gst,
    previousBalance,
    paidAmount,
    balanceDue,
    paymentStatus,
  } = props;

  // Determine page size based on items count
  const pageSize = items.length > ITEM_THRESHOLD ? "A4" : "A5";

  // Alert user if switching to A4 (run only once on mount)
  React.useEffect(() => {
    if (pageSize === "A4") {
      alert(
        `Your items count (${items.length}) exceeds threshold. Switching to A4 page size for better print layout.`
      );
    }
  }, [pageSize, items.length]);

  return (
    <InvoicePDF
      pageSize={pageSize}
      invoiceNo={invoiceNo}
      date={date}
      salesperson={salesperson}
      customerName={customerName}
      mobileNo={mobileNo}
      customer_gst= {customer_gst}
      items={items}
      Goodsreturn ={Goodsreturn}
      Grandtotal={Grandtotal}
      gstTotal={gstTotal}
      previousBalance={previousBalance}
      paidAmount={paidAmount}
      balanceDue={balanceDue}
      paymentStatus={paymentStatus}
    />
  );
};

export default InvoicePDFWrapper;
