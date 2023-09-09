import {useEffect, useState} from "react";
import {ArrowBack} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {Link, useNavigate, useParams} from "react-router-dom";

import {Navbar} from "../../components";
import {db} from "../../firebase/firebase";
import {useFirebase} from "../../firebase/AuthContext";

const ProductUpdate = () => {
  useEffect(() => {
    document.title = "TODO - Update Product";
  }, []);

  const [product, setProduct] = useState({});
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const {productId} = useParams();
  const firebase = useFirebase();

  useEffect(() => {
    const unsubscribe = async () => {
      const docRef = doc(db, "users", firebase.authUser, "products", productId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({id: docSnap.id, ...docSnap.data()});
      } else {
        navigate("/products");
      }
    };
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebase.authUser, productId]);

  const handleInput = (e) => {
    const {id, value} = e.target;
    setProduct({...product, [id]: value});
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(
        doc(db, "users", firebase.authUser, "products", productId),
        {...product},
        {merge: true}
      );
      navigate(`/products/${productId}`);
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
        <Link to="/products" style={{color: "#fff"}}>
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
            Update {product.title}
          </Typography>
          <Avatar
            src={product.img}
            alt={product.title}
            sx={{width: 100, height: 100, marginBottom: 5}}
          />
          <Typography
            variant="h2"
            mt={2}
            sx={{marginBottom: "20px", display: "none"}}
          >
            You can not update image in this application
          </Typography>
          <form onSubmit={handleUpdateProduct} style={{width: "80%"}}>
            <Box sx={{marginBottom: 2}}>
              <TextField
                id="title"
                onChange={handleInput}
                label={product.title}
                fullWidth
              />
            </Box>
            <Box sx={{marginBottom: 2}}>
              <TextField
                id="description"
                onChange={handleInput}
                label={product.description}
                fullWidth
              />
            </Box>
            <Box sx={{marginBottom: 2}}>
              <TextField
                id="category"
                onChange={handleInput}
                label={product.category}
                fullWidth
              />
            </Box>
            <Box sx={{marginBottom: 2}}>
              <TextField
                id="price"
                onChange={handleInput}
                label={product.price}
                fullWidth
              />
            </Box>
            <Box sx={{marginBottom: 2}}>
              <TextField
                id="stock"
                onChange={handleInput}
                label={product.stock}
                fullWidth
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              Update Product
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

export default ProductUpdate;
