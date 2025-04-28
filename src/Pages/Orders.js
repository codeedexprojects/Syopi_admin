import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Col, Form, Row } from "react-bootstrap";
import "./order.css";
import img from "../images/e222d69f48d84cb3db37ef787f201fdc.png";

function createData(product, payment, status, price) {
  return { product, payment, status, price };
}

const rows = [
  createData("Frozen", 159, "Processing", 24),
  createData("Ice cream", 237, "Pending", 37),
  createData("Eclair", 262, "Shipped", 24),
  createData("Cupcake", 305, "Delivered", 67),
];

function Orders() {
  const [editRowId, setEditRowId] = useState(null);
  const [status, setStatus] = useState({});

  const handleEditClick = (id) => {
    setEditRowId(id);
  };

  const handleSaveClick = (id) => {
    setEditRowId(null);
  };

  const handleStatusChange = (event, id) => {
    setStatus({ ...status, [id]: event.target.value });
  };
  return (
    <div className="order">
      <Row>
        <Col className="text-start d-product-heading">
          <p>Orders</p>
        </Col>
      </Row>
      <Row className="d-flex justify-content-start">
        <button className="order-status-button mx-2">All</button>
        <button className="order-status-button mx-2">Processing</button>
        <button className="order-status-button mx-2">Pending</button>
        <button className="order-status-button mx-2">Cancelled</button>
        <button className="order-status-button mx-2">Shipped</button>
        <button className="order-status-button mx-2">Delivered</button>
      </Row>
      <TableContainer component={Paper} className="Dproduct">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="dproduct-tablehead">Product</TableCell>
              <TableCell className="dproduct-tablehead" align="left">
                Order Date
              </TableCell>
              <TableCell className="dproduct-tablehead" align="left">
                Customer Name
              </TableCell>
              <TableCell className="dproduct-tablehead" align="left">
                Payment
              </TableCell>
              <TableCell className="dproduct-tablehead" align="left">
                Status
              </TableCell>
              <TableCell className="dproduct-tablehead" align="left">
                Price
              </TableCell>
              <TableCell className="dproduct-tablehead" align="left">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  <img
                    src={img}
                    alt="Product"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                    }}
                  />
                </TableCell>
                <TableCell align="left" className="dorder-tabledata">
                  4
                </TableCell>
                <TableCell align="left" className="dorder-tabledata">
                  john
                </TableCell>
                <TableCell align="left" className="dorder-tabledata">
                  {row.payment}
                </TableCell>
                <TableCell align="left" className="dorder-tabledata">
                  {editRowId === row.name ? (
                    <Form.Select
                      value={status[row.name] || row.status}
                      onChange={(event) => handleStatusChange(event, row.name)}
                      className="form-select-sm order-dropdown"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Pending">Pending</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </Form.Select>
                  ) : (
                    row.status
                  )}
                </TableCell>
                <TableCell align="left" className="dorder-tabledata">
                  {row.price}
                </TableCell>
                <TableCell align="left" className="dorder-tabledata">
                  {editRowId === row.name ? (
                    <p
                      className="order-save"
                      onClick={() => handleSaveClick(row.name)}
                    >
                      Save
                    </p>
                  ) : (
                    <p
                      className="order-edit"
                      onClick={() => handleEditClick(row.name)}
                    >
                      Edit
                    </p>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Orders;
