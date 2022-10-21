import {useContext, useEffect, useState} from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import {ArrowBack} from "@mui/icons-material";
import {Link, useNavigate, useParams} from "react-router-dom";
import {doc, getDoc, updateDoc} from "firebase/firestore";

import Navbar from "../../components/navbar/Navbar";
import {db} from "../../firebase";
import {AuthContext} from "../../context/AuthContext";

const CustomerUpdate = () => {
  const [customer, setCustomer] = useState({});
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const {currentUser} = useContext(AuthContext);
  const {customerId} = useParams();

  useEffect(() => {
    document.title = "TODO - Update Customer";
  }, []);

  useEffect(() => {
    const unsubscribe = async () => {
      const docRef = doc(db, "users", currentUser.uid, "customers", customerId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCustomer({id: docSnap.id, ...docSnap.data()});
      } else {
        navigate("/customers");
      }
    };
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line
  }, [currentUser.uid, customerId]);

  const handleInput = (e) => {
    const {id, value} = e.target;
    setCustomer({...customer, [id]: value});
  };

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(
        doc(db, "users", currentUser.uid, "customers", customerId),
        {...customer},
        {merge: true}
      );
      navigate(`/customers/${customerId}`);
    } catch (error) {
      setError(error.message);
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
      <Container
        maxWidth="xl"
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 5,
          marginBottom: 5,
        }}
      >
        <Box
          sx={{
            width: "80%",
            backgroundColor: "#fff",
            borderRadius: "7px",
            boxShadow: "6px 10px 21px -8px rgba(0, 0, 0, 0.66)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            padding: 5,
          }}
        >
          <Typography variant="h3" mt={2} sx={{marginBottom: "20px"}}>
            Update {customer.name}
          </Typography>
          <Avatar
            src={customer.img}
            alt={customer.name}
            sx={{width: 100, height: 100, marginBottom: 5}}
          />
          <Typography
            variant="h2"
            mt={2}
            sx={{marginBottom: "20px", display: "none"}}
          >
            You can not update image in this application
          </Typography>
          <form onSubmit={handleUpdateCustomer} style={{width: "80%"}}>
            <Box sx={{marginBottom: 2}}>
              <TextField
                id="username"
                onChange={handleInput}
                label={customer.username}
                fullWidth
              />
            </Box>
            <Box sx={{marginBottom: 2}}>
              <TextField
                id="name"
                onChange={handleInput}
                label={customer.name}
                fullWidth
              />
            </Box>
            <Box sx={{marginBottom: 2}}>
              <TextField
                id="email"
                onChange={handleInput}
                label={customer.email}
                fullWidth
              />
            </Box>
            <Box sx={{marginBottom: 2}}>
              <TextField
                id="phone"
                onChange={handleInput}
                label={customer.phone}
                fullWidth
              />
            </Box>
            <Box sx={{marginBottom: 2}}>
              <TextField
                id="address"
                onChange={handleInput}
                label={customer.address}
                fullWidth
              />
            </Box>
            <Box sx={{marginBottom: 2}}>
              <TextField
                id="country"
                onChange={handleInput}
                label={customer.country}
                fullWidth
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              Update Customer
            </Button>
            {error && (
              <Typography
                variant="h6"
                textAlign="center"
                mt={3}
                sx={{
                  color: "red",
                  textTransform: "capitalize",
                  fontWeight: "bold",
                }}
              >
                {error}
              </Typography>
            )}
          </form>
        </Box>
      </Container>
    </>
  );
};

export default CustomerUpdate;
