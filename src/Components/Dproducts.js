import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./dproduct.css";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getallProducts } from "../services/allApi";
import { useEffect } from "react";
import { BASE_URL } from "../services/baseUrl";

export default function Dproduct() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const fetchProducts = async () => {
    try {
      const response = await getallProducts();
      console.log("products", response);

      if (response && response.data) {
        const products = response.data.products.reverse();
        const latest = products.slice(0, 4);
        console.log("Latest 6 products:", latest.length);
        setProducts(latest);
      }
    } catch (err) {
      console.error("Error fetching product data:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  const productnavigate = () => {
    navigate("/products", { replace: true });
  };
  return (
    <div>
      <Row>
        <Col className="text-start d-product-heading">
          <p>Products</p>
        </Col>
        <Col
          className="text-end d-product-subheading"
          onClick={productnavigate}
        >
          <p>View all</p>
        </Col>
      </Row>
      <TableContainer component={Paper} className="Dproduct">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="product-tablehead">SI No</TableCell>
              <TableCell className="product-tablehead">Product</TableCell>

              <TableCell className="product-tablehead" align="left">
                Brand
              </TableCell>
              <TableCell className="product-tablehead" align="left">
                Code
              </TableCell>
              <TableCell className="product-tablehead" align="left">
                Stock
              </TableCell>
              <TableCell className="product-tablehead" align="left">
                Price
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((row, index) => (
              <TableRow
                key={row._id}
                style={{ cursor: "pointer" }}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  className="product-tabledata"
                >
                  {index + 1}
                </TableCell>

                <TableCell
                  component="th"
                  scope="row"
                  style={{ maxWidth: "150px" }}
                >
                  <img
                    src={
                      row.images && row.images.length > 0
                        ? `${BASE_URL}/uploads/${row.images[0]}`
                        : "/placeholder.jpg"
                    }
                    alt={row.name}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder.jpg";
                    }}
                  />
                  <br />
                  <span
                    style={{
                      display: "inline-block",
                      maxWidth: "100%",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {row.name || "-"}
                  </span>
                </TableCell>

                <TableCell align="left" className="product-tabledata">
                  {row.brand &&
                  typeof row.brand === "string" &&
                  row.brand.trim() !== ""
                    ? row.brand
                    : "-"}
                </TableCell>

                <TableCell align="left" className="product-tabledata">
                  {row.productCode || "-"}
                </TableCell>
                <TableCell align="left" className="product-tabledata">
                  {row.totalStock || 0}
                </TableCell>
                <TableCell align="left" className="product-tabledata">
                  {Array.isArray(row.variants) && row.variants.length > 0
                    ? row.variants[0].price ?? "-"
                    : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
