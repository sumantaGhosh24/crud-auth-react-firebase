import {useEffect, useState} from "react";
import {ArrowBack, Delete, Edit} from "@mui/icons-material";
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
import {deleteDoc, doc, getDoc} from "firebase/firestore";
import {Link, useNavigate, useParams} from "react-router-dom";

import {Navbar} from "../../components";
import {db} from "../../firebase/firebase";
import {useFirebase} from "../../firebase/AuthContext";

const ProductSingle = () => {
  useEffect(() => {
    document.title = "TODO - Product";
  }, []);

  const [product, setProduct] = useState({});

  const navigate = useNavigate();
  const {productId} = useParams();
  const firebase = useFirebase();

  useEffect(() => {
    const getCustomer = async () => {
      const docRef = doc(db, "users", firebase.authUser, "products", productId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({id: docSnap.id, ...docSnap.data()});
      } else {
        navigate("/products");
      }
    };
    return () => {
      getCustomer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebase.authUser, productId]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", firebase.authUser, "products", id));
      navigate("/products");
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
        <Link to="/products" style={{color: "#fff"}}>
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
            <CardMedia component="img" height="140" image={product.img} />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Title : {product.title}
              </Typography>
              <Typography
                gutterBottom
                variant="subtitle1"
                color="text.secondary"
              >
                Description : {product.description}{" "}
              </Typography>
              <Typography
                gutterBottom
                variant="subtitle1"
                color="text.secondary"
              >
                Category : {product.category}{" "}
              </Typography>
              <Typography
                gutterBottom
                variant="subtitle1"
                color="text.secondary"
              >
                Price : {product.price}{" "}
              </Typography>
              <Typography
                gutterBottom
                variant="subtitle1"
                color="text.secondary"
              >
                Stock : {product.stock}{" "}
              </Typography>
              <Typography
                gutterBottom
                variant="subtitle1"
                color="text.secondary"
              >
                Timestamp : {product.timestamp?.toDate().toDateString()}{" "}
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
                to={`/products/update/${product.id}`}
                style={{color: "white"}}
              >
                <Edit />
              </Link>
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDelete(product.id)}
            >
              <Delete />
            </Button>
          </CardActions>
        </Card>
      </Box>
    </>
  );
};

export default ProductSingle;
