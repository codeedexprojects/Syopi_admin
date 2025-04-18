import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import  './dproduct.css'
import { Col, Row } from 'react-bootstrap';
function createData(product, payment, status, price) {
  return { product, payment, status, price };
}

const rows = [
  createData('Frozen', 159, 'Processing', 24),
  createData('Ice cream', 237, 'Pending', 37),
  createData('Eclair', 262, 'Shipped', 24),
  createData('Cupcake', 305, 'Delivered', 67),
];

export default function Dproduct() {
  return (
   <div>
    <Row>
        <Col className='text-start d-product-heading' ><p>Orders</p></Col>
        <Col className='text-end d-product-subheading'><p>View all</p></Col>

    </Row>
        <TableContainer component={Paper} className='Dproduct'>
          <Table  aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className='dproduct-tablehead'>Product</TableCell>
                <TableCell className='dproduct-tablehead' align="left">Payment</TableCell>
                <TableCell className='dproduct-tablehead' align="left">status</TableCell>
                <TableCell className='dproduct-tablehead' align="left">price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  <TableCell align="left" className='dorder-tabledata'>{row.product}</TableCell>
                  <TableCell align="left" className='dorder-tabledata'>{row.payment}</TableCell>
                  <TableCell align="left" className='dorder-tabledata'>{row.status}</TableCell>
                  <TableCell align="left" className='dorder-tabledata'>{row.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
   </div>
  
  );
}
