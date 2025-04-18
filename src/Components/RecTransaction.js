import React, { useState } from 'react';
import './recenttransaction.css';
import { Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
import { Col, Row } from 'react-bootstrap';

function createData(name, calories, fat, carbs, protein, type) {
  return { name, calories, fat, carbs, protein, type };
}

const rows = [
  createData('Frozen', 159, 6.0, 24, 4.0, 'Income'),
  createData('Ice cream', 237, 9.0, 37, 4.3, 'Refund'),
  createData('Eclair', 262, 16.0, 24, 6.0, 'Income'),
  createData('Cupcake', 305, 3.7, 67, 4.3, 'Refund'),
];

function RecTransaction() {
  const [selectedCategory, setSelectedCategory] = useState('All Transactions');

  // Filter rows based on the selected category
  const filteredRows = selectedCategory === 'All Transactions' 
    ? rows 
    : rows.filter(row => row.type === selectedCategory);

  return (
    <div>
      <p className='rec-transaction-title'>Recent Transactions</p>
      <Row className='w-50 mt-3'>
        <Col
          className={`recent-subtitle ${selectedCategory === 'All Transactions' ? 'selected' : ''}`}
          onClick={() => setSelectedCategory('All Transactions')}
        >
          All Transactions
        </Col>
        <Col
          className={`recent-subtitle ${selectedCategory === 'Income' ? 'selected' : ''}`}
          onClick={() => setSelectedCategory('Income')}
        >
          Income
        </Col>
        <Col
          className={`recent-subtitle ${selectedCategory === 'Refund' ? 'selected' : ''}`}
          onClick={() => setSelectedCategory('Refund')}
        >
          Refund
        </Col>
      </Row>
      
      <TableContainer component={Paper} className='Recent'>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className='recent-tablehead'>Description</TableCell>
              <TableCell className='recent-tablehead' align="left">Transaction ID</TableCell>
              <TableCell className='recent-tablehead' align="left">Type</TableCell>
              <TableCell className='recent-tablehead' align="left">Card</TableCell>
              <TableCell className='recent-tablehead' align="left">Date</TableCell>
              <TableCell className='recent-tablehead' align="left">Amount</TableCell>
              <TableCell className='recent-tablehead' align="left">Receipt</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow
                key={row.name}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell align="left" className='recent-tabledata'>{row.calories}</TableCell>
                <TableCell align="left" className='recent-tabledata'>{row.calories}</TableCell>
                <TableCell align="left" className='recent-tabledata'>{row.fat}</TableCell>
                <TableCell align="left" className='recent-tabledata'>1234</TableCell>
                <TableCell align="left" className='recent-tabledata'>{row.protein}</TableCell>
                <TableCell align="left" className='recent-tabledata-amount'>{row.protein}</TableCell>
                <TableCell align="left" className='recent-tabledata'>
                  <button className='recent-table-button'>Download</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Row className='mt-4 pagination-row'>
        <Pagination className='pagination' count={10} variant="outlined" />
      </Row>
    </div>
  );
}

export default RecTransaction;
