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
import {Add, Delete, Edit, Visibility} from "@mui/icons-material";
import {Link} from "react-router-dom";

import {db} from "../../firebase/firebase";
import {Navbar} from "../../components";
import {useFirebase} from "../../firebase/AuthContext";

const ProductList = () => {
  useEffect(() => {
    document.title = "TODO - Product List";
  }, []);

  const [rows, setRows] = useState([]);

  const firebase = useFirebase();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users", firebase.authUser, "products"),
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
      await deleteDoc(doc(db, "users", firebase.authUser, "products", id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="xl">
        <Typography variant="h4" textAlign="center" sx={{marginTop: 5}}>
          Products List
        </Typography>
        <Button variant="contained" color="primary" startIcon={<Add />}>
          <Link to="/products/new" style={{color: "#fff"}}>
            Add New Product
          </Link>
        </Button>
        <TableContainer component={Paper} sx={{marginTop: "50px"}}>
          {rows.length === 0 ? (
            <Typography
              variant="h4"
              textAlign="center"
              sx={{marginTop: 5, marginBottom: 5}}
            >
              You don't have any product yet!
            </Typography>
          ) : (
            <Table sx={{minWidth: 650}} aria-label="products table">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell align="right">Description</TableCell>
                  <TableCell align="right">Category</TableCell>
                  <TableCell align="right">Image</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Stock</TableCell>
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
                      {row.title}
                    </TableCell>
                    <TableCell align="right">{row.description}</TableCell>
                    <TableCell align="right">{row.category}</TableCell>
                    <TableCell align="right">
                      <Avatar src={row.img} alt={row.name} />
                    </TableCell>
                    <TableCell align="right">{row.price}</TableCell>
                    <TableCell align="right">{row.stock}</TableCell>
                    <TableCell align="right">
                      {row.timestamp?.toDate().toDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <Button variant="contained" color="secondary">
                        <Link
                          to={`/products/${row.id}`}
                          style={{color: "white"}}
                        >
                          <Visibility />
                        </Link>
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        sx={{marginLeft: 2, marginRight: 2}}
                      >
                        <Link
                          to={`/products/update/${row.id}`}
                          style={{color: "white"}}
                        >
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
};

export default ProductList;
