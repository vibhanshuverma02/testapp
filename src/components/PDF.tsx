"use client";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

// Register fonts
Font.register({ family: "NotoSans", src: "/font/NotoSans-Regular.ttf" });
Font.register({
  family: "NotoSansDevanagari",
  src: "/font/NotoSansDevanagari-Regular.ttf",
});

const getStyles = (pageSize: "A4" | "A5") =>
  StyleSheet.create({
    page: {
      fontFamily: "NotoSans",
      fontSize: pageSize === "A4" ? 8 : 7,
      padding: 0,
      flexDirection: "column",
      justifyContent: "flex-start",
      height: "100%",
    },
    outerWrapper: {
      border: "1px solid black",
      padding: pageSize === "A4" ? 16 : 10,
      margin: pageSize === "A4" ? 36 : 20,
      height: "96%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      boxSizing: "border-box",
      position: "relative",
    },
    content: { flexGrow: 1 },
    header: {
      textAlign: "center",
      marginBottom: 6,
      paddingVertical: 4,
    },
    shopName: {
      fontSize: pageSize === "A4" ? 16 : 14,
      fontWeight: "bold",
    },
    shopInfo: {
      fontSize: pageSize === "A4" ? 9 : 9,
      marginTop: 2,
    },
    title: {
      textAlign: "center",
      fontSize: pageSize === "A4" ? 10 : 10,
      fontWeight: "bold",
      marginTop: 6,
      marginBottom: 6,
      textDecoration: "underline",
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 2,
    },
    label: { fontWeight: "bold" },
    itemHeader: {
      flexDirection: "row",
      marginTop: 10,
      marginBottom: 4,
      fontWeight: "bold",
      borderBottom: "1px solid black",
      borderTop: "1px solid black",
      paddingVertical: 2,
    },
    itemRow: {
      flexDirection: "row",
      paddingVertical: 2,
    },
    totals: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 10,
    },
    totalsRight: {
      width: "50%",
      fontSize: pageSize === "A4" ? 8 : 7,
      lineHeight: 1.4,
      padding: 6,
      border: "1px solid black",
    },
    bilingualText: {
      fontFamily: "NotoSansDevanagari",
      fontSize: pageSize === "A4" ? 7 : 7,
      textAlign: "center",
      marginTop: 3,
      lineHeight: 1.5,
    },
    footer: {
      textAlign: "center",
      fontSize: pageSize === "A4" ? 7 : 6,
      paddingTop: 4,
      marginBottom: 20,
    },
  });

const col = (
  width: string,
  pageSize: "A4" | "A5",
  align: "left" | "center" | "right" = "left"
) => ({
  width,
  fontSize: pageSize === "A4" ? 8 : 7,
  textAlign: align,
  paddingHorizontal: 2,
});

interface InvoicePDFProps {
  pageSize: "A4" | "A5";
  invoiceNo: string;
  date: string;
  customerName: string;
  mobileNo: string;
  salesperson: string;
  customer_gst: string;
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
  Goodsreturn: number|null;
}

const InvoicePDF = ({
  pageSize,
  invoiceNo,
  date,
  customerName,
  mobileNo,
  customer_gst,
  salesperson,
  items,
  Goodsreturn,
  Grandtotal,
  gstTotal,
  paidAmount,
  balanceDue,
  previousBalance,
  paymentStatus,
}: InvoicePDFProps) => {
  const styles = getStyles(pageSize);
  const isRealCustomer = customerName !== "NA" && mobileNo !== "0000000000";
    const isPartialCustomer = customerName !== "NA" && mobileNo.toLowerCase() === "anonymous";

  return (
    <Document>
      <Page size={pageSize} style={styles.page}>
        <View style={styles.outerWrapper}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Image
                src="/images/final2-Photoroom.png"
                style={{
                  width: pageSize === "A4" ? 80 : 60,
                  height: pageSize === "A4" ? 55 : 40,
                  alignSelf: "center",
                  marginBottom: pageSize === "A4" ? 10 : 5,
                }}
              />
              <Text style={{ fontSize: 7 }}>GSTIN: 05ASTPK6699N1ZJ</Text>
              <Text style={styles.title}>TAX INVOICE</Text>
              <Text style={styles.shopName}>KUKREJA SAREE CENTER</Text>
              <Text style={styles.bilingualText}>(सरदार जी )</Text>
              <Text style={styles.shopInfo}>
                Arya Samaj road B.T. Ganj Roorkee
              </Text>
            </View>

            {/* Invoice Info */}
            <View style={[styles.row, { marginTop: 6 }]}>
              {(isRealCustomer || isPartialCustomer)&& (
                <Text>
                  <Text style={styles.label}>Party:</Text> {customerName}
                </Text>
              )}
             {customer_gst && customer_gst.trim() !== "" && (
    <Text>
      <Text style={styles.label}> Party-GSTIN:</Text> {customer_gst}
    </Text>
  )}
            <Text>
  <Text style={styles.label}>Bill No.:</Text> {invoiceNo}
</Text>

            </View>

           
            <View style={styles.row}>
  {isPartialCustomer ? (
    <Text>
      <Text style={styles.label}>Payment Status:</Text> paid
    </Text>
  ) : isRealCustomer ? (
    <Text>
      <Text style={styles.label}>Payment Status:</Text>{" "}
      {paidAmount === 0 ? "paid" : paymentStatus || "pending"}
    </Text>
  ) : (
    <Text>
      <Text style={styles.label}>Payment Status:</Text> paid
    </Text>
  )}

  <Text>
    <Text style={styles.label}>Bill Date:</Text>{" "}
    {new Date(date).toLocaleDateString("en-IN")}
  </Text>
</View>

{/* ✅ Salesperson shown with gap */}
<View style={{ ...styles.row, marginTop: 8 }}>
  <Text>
    <Text style={styles.label}>Salesperson:</Text> {salesperson || "N/A"}
  </Text>
</View>



            {/* Items Table */}
            <View style={{ marginTop: 8 }}>
              <View style={styles.itemHeader}>
                <Text style={col("6%", pageSize, "center")}>S.N.</Text>
                <Text style={col("38%", pageSize)}>Description</Text>
                <Text style={col("17%", pageSize, "left")}>Rate</Text>
                <Text style={col("10%", pageSize, "center")}>Qty</Text>
                <Text style={col("22%", pageSize, "right")}>Amount</Text>
              </View>

              {items.map((item, index) => {
               const baseRate = Math.round(item.rate / (1 + item.gstRate / 100)); // Rounded base rate
                const amount = Math.round(item.rate * item.quantity); // Rounded amount

                return (
                  <View key={index} style={styles.itemRow}>
                    <Text style={col("6%", pageSize, "center")}>{index + 1}</Text>
                    <Text style={col("38%", pageSize)}>{item.itemName}</Text>
                    <Text style={col("17%", pageSize, "left")}>
                      ₹{baseRate}
                    </Text>
                    <Text style={col("10%", pageSize, "center")}>
                      {item.quantity}
                    </Text>
                    <Text style={col("22%", pageSize, "right")}>
                      ₹{amount}
                    </Text>
                  </View>
                );
              })}

              {/* Total Quantity Row */}
              <View
                style={{
                  flexDirection: "row",
                  borderTop: "1px solid black",
                  backgroundColor: "#f9f9f9",
                  paddingVertical: 4,
                }}
              >
                <Text style={col("6%", pageSize)} />
                <Text style={col("25%", pageSize)} />
                <Text style={col("13%", pageSize)}>Total</Text>
                <Text style={col("17%", pageSize)} />
                <Text style={col("10%", pageSize, "center")}>
                  {items.reduce((sum, item) => sum + item.quantity, 0)}
                </Text>
                <Text style={col("22%", pageSize)} />
              </View>
            </View>

               {/* Totals Section */}
            <View style={styles.totals}>
              <View style={styles.totalsRight}>
                <View
                  style={{ flexDirection: "row", justifyContent: "space-between" }}
                >
                  <Text>CGST:</Text>
                  <Text>₹{Math.round(gstTotal / 2)}</Text>
                </View>
                <View
                  style={{ flexDirection: "row", justifyContent: "space-between" }}
                >
                  <Text>SGST:</Text>
                  <Text>₹{Math.round(gstTotal / 2)}</Text>
                </View>

   {Goodsreturn && Goodsreturn > 0 && (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 4,
      }}
    >
      <Text>Goods Return:</Text>
      <Text>₹{Math.round(Goodsreturn)}</Text>
    </View>
  )}
                  {isRealCustomer && previousBalance > 0 && (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 4,
        }}
      >
        <Text>Previous Balance:</Text>
        <Text>₹{Math.round(previousBalance)}</Text>
      </View>
    )}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 8,
                    marginTop: 4,
                    borderTop: "0.5px dashed #aaa",
                    paddingTop: 4,
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>Total Amt.:</Text>
                  <Text style={{ fontWeight: "bold" }}>₹{Math.round(Grandtotal)}</Text>
                </View>

                {/* Show Paid & Balance ONLY for real customers if paidAmount > 0 and less than Grandtotal */}
                {isRealCustomer ? (
                  paidAmount > 0 && paidAmount < Grandtotal ? (
                    <>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text>Paid Amt.:</Text>
                        <Text>₹{Math.round(paidAmount)}</Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text>Balance Due:</Text>
                        <Text>
                          ₹{balanceDue !== null ? Math.round(balanceDue) : "0.00"}
                        </Text>
                      </View>
                    </>
                  ) : paidAmount >= Grandtotal ? (
                    // If paidAmount equals or more than Grandtotal, show only paid amount
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      
                      <Text>₹{Math.round(paidAmount)}</Text>
                    </View>
                  ) : (
                    // paidAmount === 0 for real customers: show only payment status, no paid or balance
                    <></>
                  )
                ) : (
                  // For NA customer and mobile no 0000000000: always show payment status paid, no paid or balance
                  <></>
                )}

                {/* Payment Status for NA / 0000000000 customers */}
                {/* {!isRealCustomer && (
                  <View style={{ marginTop: 6 }}>
                    <Text>
                      <Text style={styles.label}>Payment Status: </Text>paid
                    </Text>
                  </View>
                )} */}
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text>Thank you visit again!</Text>
            <Text style={styles.bilingualText}>
              फॉल की सभी साड़ियाँ और लहंगे के लिए कृपया बिल साथ लाएँ, क्योंकि बिना बिल के सामान नहीं मिलेगा।
            </Text>
            <Text>No Claim No Exchange</Text>
            <Text>For any queries, please contact us at 8439751861</Text>
            <Text>
              © kukreja saree center Arya Samaj road B.T. Ganj Roorkee 247667. All rights reserved.
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
