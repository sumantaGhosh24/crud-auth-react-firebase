import {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {deleteDoc, doc, getDoc} from "firebase/firestore";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import {ArrowBack, Delete, Edit} from "@mui/icons-material";

import {db} from "../../firebase/firebase";
import {Navbar} from "../../components";
import {useFirebase} from "../../firebase/AuthContext";

const CustomerSingle = () => {
  useEffect(() => {
    document.title = "TODO - Customer";
  }, []);

  const [customer, setCustomer] = useState({});

  const navigate = useNavigate();
  const {customerId} = useParams();
  const firebase = useFirebase();

  useEffect(() => {
    const getCustomer = async () => {
      const docRef = doc(
        db,
        "users",
        firebase.authUser,
        "customers",
        customerId
      );
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCustomer({id: docSnap.id, ...docSnap.data()});
      } else {
        navigate("/customers");
      }
    };
    return () => {
      getCustomer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebase.authUser, customerId]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", firebase.authUser, "customers", id));
      navigate("/customers");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      <Button
        variant="contained"
        color="primary"
        startIcon={<ArrowBack />}
        sx={{marginBottom: 5, marginLeft: 5, marginTop: 5}}
      >
        <Link to="/customers" style={{color: "#fff"}}>
          Go Back
        </Link>
      </Button>
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card sx={{maxWidth: 450, marginTop: 5}}>
          <CardActionArea>
            <CardMedia component="img" height="140" image={customer.img} />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Username : {customer.username}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
              >
                Name : {customer.name}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
              >
                Email Address : {customer.email}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
              >
                Phone Number : {customer.phone}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
              >
                Country : {customer.country}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
              >
                Address : {customer.address}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
              >
                Timestamp : {customer.timestamp?.toDate().toDateString()}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button
              variant="contained"
              color="success"
              sx={{marginLeft: 2, marginRight: 2}}
            >
              <Link
                to={`/customers/update/${customer.id}`}
                style={{color: "white"}}
              >
                <Edit />
              </Link>
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDelete(customer.id)}
            >
              <Delete />
            </Button>
          </CardActions>
        </Card>
      </Box>
    </>
  );
};

export default CustomerSingle;
