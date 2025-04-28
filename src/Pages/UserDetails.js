import { Row, Col, Form } from "react-bootstrap";
import user from "../images/user.png";
import "./userdetails.css";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import img from "../images/e222d69f48d84cb3db37ef787f201fdc.png";

function UserDetails() {
  function createData(product, payment, status, price) {
    return { product, payment, status, price };
  }

  const rows = [
    createData("Frozen", 159, "Processing", 24),
    createData("Ice cream", 237, "Pending", 37),
    createData("Eclair", 262, "Shipped", 24),
    createData("Cupcake", 305, "Delivered", 67),
  ];

  return (
    <div className=" single-product">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="single-product-title">User Details</h2>
        </Col>
        <Col className="text-end">
          <button className="me-2 suspend-user-button">Suspend</button>
          <button className="reactivate-user-button">Reactivate</button>
          <button className="ms-2 remove-user-button">Delete</button>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <img src={user} alt="Product" className=" userimg" />
        </Col>
        <Col md={9} className="single-product-right-column">
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Name
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="John"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Email
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="John@gmail.com"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Phone Number
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="+94874"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Gender
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Male"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Location
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Calicut, Kerala, 673011"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Delivery Address
                  </Form.Label>
                  <Form.Control
                    className="single-product-form-address"
                    as="textarea"
                    rows={3}
                    placeholder="Rahul Nair, 14, SM Street, Mananchira, Kozhikode, Calicut District, Kerala, 673001.
4o mini"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col md={6}>
          <Row>
            <Col className="text-start d-product-heading">
              <p>Orders</p>
            </Col>
          </Row>

          <TableContainer component={Paper} className="Dproduct">
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="dproduct-tablehead">Product</TableCell>
                  <TableCell className="dproduct-tablehead" align="left">
                    Payment
                  </TableCell>
                  <TableCell className="dproduct-tablehead" align="left">
                    status
                  </TableCell>
                  <TableCell className="dproduct-tablehead" align="left">
                    price
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell align="left" className="dorder-tabledata">
                      {row.product}
                    </TableCell>
                    <TableCell align="left" className="dorder-tabledata">
                      {row.payment}
                    </TableCell>
                    <TableCell align="left" className="dorder-tabledata">
                      {row.status}
                    </TableCell>
                    <TableCell align="left" className="dorder-tabledata">
                      {row.price}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Col>

        <Col md={6}>
          <Col className="text-start d-product-heading">
            <p>Whishlist</p>
          </Col>
          <TableContainer component={Paper} className="Dproduct">
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="dproduct-tablehead">Product</TableCell>
                  <TableCell className="dproduct-tablehead" align="left">
                    Code
                  </TableCell>
                  <TableCell className="dproduct-tablehead" align="left">
                    Stock
                  </TableCell>
                  <TableCell className="dproduct-tablehead" align="left">
                    Price
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      <img
                        src={img}
                        alt="Product"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "8px",
                        }}
                      />{" "}
                      <span className="dproduct-tabledata">
                        Regular Fit Jacket
                      </span>
                    </TableCell>
                    <TableCell align="left" className="dproduct-tabledata">
                      {" "}
                      45837
                    </TableCell>
                    <TableCell align="left" className="dproduct-tabledata">
                      122
                    </TableCell>
                    <TableCell align="left" className="dproduct-tabledata">
                      2,999.00
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Col>
      </Row>
    </div>
  );
}

export default UserDetails;
