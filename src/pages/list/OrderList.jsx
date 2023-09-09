import {useEffect, useState} from "react";
import {collection, deleteDoc, doc, onSnapshot} from "firebase/firestore";
import {
  Avatar,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Container,
} from "@mui/material";
import {Add, Delete} from "@mui/icons-material";
import {Link} from "react-router-dom";

import {db} from "../../firebase/firebase";
import {Navbar} from "../../components";
import {useFirebase} from "../../firebase/AuthContext";

const OrderList = () => {
  useEffect(() => {
    document.title = "TODO - Order List";
  }, []);

  const [rows, setRows] = useState([]);

  const firebase = useFirebase();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users", firebase.authUser, "orders"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach(
          (doc) => {
            list.push({id: doc.id, ...doc.data()});
            setRows(list);
          },
          (error) => {
            console.log(error);
          }
        );
        return () => {
          unsubscribe();
        };
      }
    );
  }, [firebase.authUser]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", firebase.authUser, "orders", id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="xl">
        <Typography variant="h4" textAlign="center" sx={{marginTop: 5}}>
          Orders List
        </Typography>
        <Button variant="contained" color="primary" startIcon={<Add />}>
          <Link to="/orders/new" style={{color: "#fff"}}>
            Add New Order
          </Link>
        </Button>
        <TableContainer component={Paper} sx={{marginTop: "50px"}}>
          {rows.length === 0 ? (
            <Typography
              variant="h4"
              textAlign="center"
              sx={{marginTop: 5, marginBottom: 5}}
            >
              You don't have any order yet!
            </Typography>
          ) : (
            <Table sx={{minWidth: 650}} aria-label="orders table">
              <TableHead>
                <TableRow>
                  <TableCell>Order Id</TableCell>
                  <TableCell align="right">Name</TableCell>
                  <TableCell align="right">Username</TableCell>
                  <TableCell align="right">Image</TableCell>
                  <TableCell align="right">Email</TableCell>
                  <TableCell align="right">Phone</TableCell>
                  <TableCell align="right">Address</TableCell>
                  <TableCell align="right">Country</TableCell>
                  <TableCell align="right">Timestamp</TableCell>
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
                      {row.id}
                    </TableCell>
                    <TableCell align="right">{row.user.name}</TableCell>
                    <TableCell align="right">{row.user.username}</TableCell>
                    <TableCell align="right">
                      <Avatar src={row.user.img} alt={row.user.name} />
                    </TableCell>
                    <TableCell align="right">{row.user.email}</TableCell>
                    <TableCell align="right">{row.user.phone}</TableCell>
                    <TableCell align="right">{row.user.address}</TableCell>
                    <TableCell align="right">{row.user.country}</TableCell>
                    <TableCell align="right">
                      {row.user.timestamp?.toDate().toDateString()}
                    </TableCell>
                    <TableCell align="right">
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
};

export default OrderList;
