import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { getVendorOrdersApi } from "../../services/allApi";

export default function VDOrder() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getVendorOrdersApi();

        if (response.success) {
          const orders = response.data.orders.reverse();
          const latest = orders.slice(0, 4);
          setOrders(latest);
        } else {
        }
      } catch (err) {
      } finally {
      }
    };

    fetchOrders();
  }, []);
  const ordernavigate = () => {
    navigate("/orders", { replace: true });
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN"); // Indian date format
  };

  return (
    <div>
      <Row>
        <Col className="text-start d-product-heading">
          <p>Orders</p>
        </Col>
        <Col className="text-end d-product-subheading" onClick={ordernavigate}>
          <p>View all</p>
        </Col>
      </Row>
      <TableContainer component={Paper} className="Dproduct">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="dproduct-tablehead">SI No</TableCell>
              <TableCell className="dproduct-tablehead" align="left">
                Order Date
              </TableCell>
              <TableCell className="dproduct-tablehead" align="left">
                Customer ID
              </TableCell>
              <TableCell className="dproduct-tablehead" align="left">
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((row, index) => (
              <TableRow
                key={row._id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell align="left" className="dorder-tabledata">
                  {index + 1}
                </TableCell>
                <TableCell align="left" className="dorder-tabledata">
                  {" "}
                  {formatDate(row.createdAt)}
                </TableCell>
                <TableCell align="left" className="dorder-tabledata">
                  {row.userId}
                </TableCell>
                <TableCell align="left" className="dorder-tabledata">
                  {row.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
