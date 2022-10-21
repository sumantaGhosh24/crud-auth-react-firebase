import React, {useContext, useEffect, useState} from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {Avatar, Button, Container, Typography} from "@mui/material";
import {Add, Delete, Edit, Visibility} from "@mui/icons-material";
import {Link} from "react-router-dom";
import {collection, deleteDoc, doc, onSnapshot} from "firebase/firestore";

import Navbar from "../../components/navbar/Navbar";
import {AuthContext} from "../../context/AuthContext";
import {db} from "../../firebase";

export default function CustomerList() {
  const [rows, setRows] = useState([]);

  const {currentUser} = useContext(AuthContext);

  useEffect(() => {
    document.title = "TODO | Customer List";
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users", currentUser.uid, "customers"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          list.push({id: doc.id, ...doc.data()});
        });
        setRows(list);
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unsubscribe();
    };
  }, [currentUser.uid]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", currentUser.uid, "customers", id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="xl">
        <Typography variant="h4" textAlign="center" sx={{marginTop: 5}}>
          Customers List
        </Typography>
        <Button variant="contained" color="primary" startIcon={<Add />}>
          <Link to="/customers/new" style={{color: "#fff"}}>
            Add New Customer
          </Link>
        </Button>
        <TableContainer component={Paper} sx={{marginTop: "50px"}}>
          {rows.length === 0 ? (
            <Typography
              variant="h4"
              textAlign="center"
              sx={{marginTop: 5, marginBottom: 5}}
            >
              You don't have any customer yet!
            </Typography>
          ) : (
            <Table sx={{minWidth: 650}} aria-label="customers table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Username</TableCell>
                  <TableCell align="right">Email Address</TableCell>
                  <TableCell align="right">Phone Number</TableCell>
                  <TableCell align="right">Image</TableCell>
                  <TableCell align="right">Address</TableCell>
                  <TableCell align="right">Country</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{"&:last-child td, &:last-child th": {border: 0}}}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.username}</TableCell>
                    <TableCell align="right">{row.email}</TableCell>
                    <TableCell align="right">{row.phone}</TableCell>
                    <TableCell align="right">
                      <Avatar src={row.img} alt={row.name} />
                    </TableCell>
                    <TableCell align="right">{row.address}</TableCell>
                    <TableCell align="right">{row.country}</TableCell>
                    <TableCell align="right">
                      <Button variant="contained" color="secondary">
                        <Link to={`/customers/${row.id}`}>
                          <Visibility />
                        </Link>
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        sx={{marginLeft: 2, marginRight: 2}}
                      >
                        <Link to={`/customers/update/${row.id}`}>
                          <Edit />
                        </Link>
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(row.id)}
                      >
                        <Delete />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Container>
    </>
  );
}
