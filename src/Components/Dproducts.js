import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import img from '../images/e222d69f48d84cb3db37ef787f201fdc.png';
import  './dproduct.css'
import { Col, Row } from 'react-bootstrap';
function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen', 159, 6.0, 24, 4.0),
  createData('Ice cream', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
];
const productnavigate =()=>{
  window.location.href = "/products";
}

export default function Dproduct() {
  return (
   <div>
    <Row>
        <Col className='text-start d-product-heading'><p>Products</p></Col>
        <Col className='text-end d-product-subheading' onClick={productnavigate}><p>View all</p></Col>

    </Row>
        <TableContainer component={Paper} className='Dproduct'>
          <Table  aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className='dproduct-tablehead'>Product</TableCell>
                <TableCell className='dproduct-tablehead' align="left">Name</TableCell>
                <TableCell className='dproduct-tablehead' align="left">Code</TableCell>
                <TableCell className='dproduct-tablehead' align="left">Stock</TableCell>
                <TableCell className='dproduct-tablehead' align="left">Price</TableCell>
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
                  <TableCell component="th" scope="row" >
                    <img src={img} alt="Product" style={{ width: '40px', height: '40px',borderRadius:'8px' }} />
                  </TableCell>
                  <TableCell align="left" className='dproduct-tabledata'>{row.calories}</TableCell>
                  <TableCell align="left" className='dproduct-tabledata'>{row.fat}</TableCell>
                  <TableCell align="left" className='dproduct-tabledata'>{row.carbs}</TableCell>
                  <TableCell align="left" className='dproduct-tabledata'>{row.protein}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
   </div>
  );
}
