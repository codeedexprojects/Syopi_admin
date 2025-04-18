import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Col, Row } from 'react-bootstrap';
import HashLoader from 'react-spinners/HashLoader';
import img from '../images/e222d69f48d84cb3db37ef787f201fdc.png';
import './Leaderboard.css';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen', 159, 6.0, 24, 4.0),
  createData('Ice cream', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
];

export default function Leaderboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div>
      {loading ? (
        <div className="loader-container">
          <HashLoader color="#36d7b7" size={60} />
        </div>
      ) : (
        <>
          <Row>
            <Col>
              <p className="leaderboard-heading">User Leaderboard</p>
            </Col>
            <Col>
              <p className="leaderboard-subheading">View full leaderboard</p>
            </Col>
          </Row>
          <TableContainer component={Paper} className="leaderboard" style={{ overflowX: 'hidden' }}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="leaderboard-tablehead">Name</TableCell>
                  <TableCell className="leaderboard-tablehead" align="left">User ID</TableCell>
                  <TableCell className="leaderboard-tablehead" align="left">Points</TableCell>
                  <TableCell className="leaderboard-tablehead" align="left">Joined</TableCell>
                  <TableCell className="leaderboard-tablehead" align="left">Action</TableCell>
                  <TableCell className="leaderboard-tablehead" align="left"></TableCell>
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
                    <TableCell component="th" scope="row">
                      <img src={img} alt="Product" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
                      <span className="ms-3 table-name">Name</span>
                    </TableCell>
                    <TableCell align="left" className="leaderboard-tabledata">{row.calories}</TableCell>
                    <TableCell align="left" className="leaderboard-tabledata">{row.fat}</TableCell>
                    <TableCell align="left" className="leaderboard-tabledata">{row.carbs}</TableCell>
                    <TableCell align="left" className="leaderboard-tableaction">...</TableCell>
                    <TableCell align="left" className="leaderboard-tableview">View Profile</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
}
