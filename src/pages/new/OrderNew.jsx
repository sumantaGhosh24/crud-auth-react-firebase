import {useEffect, useState} from "react";
import {ArrowBack} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Checkbox,
  Container,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import {Link, useNavigate} from "react-router-dom";
import {v4 as uuidv4} from "uuid";

import {Navbar} from "../../components";
import {useFirebase} from "../../firebase/AuthContext";
import {db} from "../../firebase/firebase";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const OrderNew = () => {
  useEffect(() => {
    document.title = "TODO - New Order";
  }, []);

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [user, setUser] = useState({});
  const [error, setError] = useState("");
  const [selectCustomer, setSelectCustomer] = useState("");
  const [selectProduct, setSelectProduct] = useState([]);

  const firebase = useFirebase();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users", firebase.authUser, "products"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach(
          (doc) => {
            list.push({id: doc.id, ...doc.data()});
            setProducts(list);
          },
          (error) => {
            setError(error.message);
          }
        );
      }
    );
    return () => {
      unsubscribe();
    };
  }, [firebase.authUser]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users", firebase.authUser, "customers"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach(
          (doc) => {
            list.push({id: doc.id, ...doc.data()});
            setCustomers(list);
          },
          (error) => {
            setError(error.message);
          }
        );
      }
    );
    return () => {
      unsubscribe();
    };
  }, [firebase.authUser]);

  useEffect(() => {
    const getUser = async () => {
      const docRef = doc(db, "users", firebase.authUser);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUser({id: docSnap.id, ...docSnap.data()});
      }
    };
    return () => {
      getUser();
    };
  }, [firebase.authUser]);

  const handleChange = (event) => {
    const {
      target: {value},
    } = event;
    setSelectProduct(typeof value === "string" ? value.split(",") : value);
  };

  const filterProducts = products.filter((element) =>
    selectProduct.includes(element.id)
  );

  const handleAddOrder = async (e) => {
    e.preventDefault();
    const orderId = uuidv4();
    try {
      setLoading(true);
      await setDoc(doc(db, "users", firebase.authUser, "orders", orderId), {
        user: user,
        customer: selectCustomer,
        products: selectProduct,
        timestamp: serverTimestamp(),
      });
      setLoading(false);
      navigate("/orders");
    } catch (error) {
      setError(error.message);
      setLoading(false);
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
          flexWrap: "wrap",
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
            Create New Order
          </Typography>
          <form onSubmit={handleAddOrder} style={{width: "80%"}}>
            <FormControl fullWidth sx={{marginBottom: 3}}>
              <InputLabel id="customer">Select Customer</InputLabel>
              <Select
                labelId="customer"
                id="customer"
                value={selectCustomer}
                label="Age"
                onChange={(e) => setSelectCustomer(e.target.value)}
              >
                {customers.map((customer) => (
                  <MenuItem value={customer.id} key={customer.id}>
                    {customer.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{marginBottom: 3}}>
              <InputLabel id="product">Select Products</InputLabel>
              <Select
                labelId="product"
                id="product"
                multiple
                value={selectProduct}
                onChange={handleChange}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    <Checkbox
                      checked={selectProduct.indexOf(product.id) > -1}
                    />
                    <ListItemText primary={product.title} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={
                !selectCustomer || selectProduct.length === 0 || loading
              }
            >
              {loading ? "Please Wait..." : "Add Order"}
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
        <Box
          sx={{
            width: "80%",
            backgroundColor: "#fff",
            borderRadius: "7px",
            boxShadow: "6px 10px 21px -8px rgba(0, 0, 0, 0.66)",
            display: "flex",
            flexDirection: "column",
            padding: 5,
            marginTop: 10,
          }}
        >
          <Typography
            variant="h3"
            mt={2}
            sx={{marginBottom: "20px", textAlign: "center"}}
          >
            Order Preview
          </Typography>
          <Typography gutterBottom variant="h5" component="div">
            Owner Details
          </Typography>
          <Card sx={{maxWidth: 345, marginBottom: 5}}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image={user.imageUrl}
                alt={user.name}
              />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="subtitle1"
                  color="text.secondary"
                >
                  Name : {user.name}
                </Typography>
                <Typography
                  gutterBottom
                  variant="subtitle1"
                  color="text.secondary"
                >
                  Username : {user.username}{" "}
                </Typography>
                <Typography
                  gutterBottom
                  variant="subtitle1"
                  color="text.secondary"
                >
                  Email : {user.email}{" "}
                </Typography>
                <Typography
                  gutterBottom
                  variant="subtitle1"
                  color="text.secondary"
                >
                  Phone : {user.phone}{" "}
                </Typography>
                <Typography
                  gutterBottom
                  variant="subtitle1"
                  color="text.secondary"
                >
                  Address : {user.address}{" "}
                </Typography>
                <Typography
                  gutterBottom
                  variant="subtitle1"
                  color="text.secondary"
                >
                  Country : {user.country}{" "}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Typography gutterBottom variant="h5" component="div">
            Customer Details
          </Typography>
          {customers.map(
            (customer) =>
              customer.id === selectCustomer && (
                <Card sx={{maxWidth: 345, marginBottom: 5}} key={customer.id}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image={customer.img}
                      alt={customer.name}
                    />
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="subtitle1"
                        color="text.secondary"
                      >
                        Name : {customer.name}
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="subtitle1"
                        color="text.secondary"
                      >
                        Username : {customer.username}{" "}
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="subtitle1"
                        color="text.secondary"
                      >
                        Email : {customer.email}{" "}
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="subtitle1"
                        color="text.secondary"
                      >
                        Phone : {customer.phone}{" "}
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="subtitle1"
                        color="text.secondary"
                      >
                        Address : {customer.address}{" "}
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="subtitle1"
                        color="text.secondary"
                      >
                        Country : {customer.country}{" "}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              )
          )}
          <Typography gutterBottom variant="h5" component="div">
            Product Details
          </Typography>
          {filterProducts.map((aProduct) => (
            <Card sx={{maxWidth: 345, marginBottom: 5}} key={aProduct.id}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image={aProduct.img}
                  alt={aProduct.title}
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="subtitle1"
                    color="text.secondary"
                  >
                    Title : {aProduct.title}
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="subtitle1"
                    color="text.secondary"
                  >
                    Description : {aProduct.description}{" "}
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="subtitle1"
                    color="text.secondary"
                  >
                    Category : {aProduct.category}{" "}
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="subtitle1"
                    color="text.secondary"
                  >
                    Price : {aProduct.price}{" "}
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="subtitle1"
                    color="text.secondary"
                  >
                    Stock : {aProduct.stock}{" "}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Container>
    </>
  );
};

export default OrderNew;
