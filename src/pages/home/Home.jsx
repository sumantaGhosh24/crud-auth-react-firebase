import {useEffect, useState} from "react";
import {Box, Container} from "@mui/system";
import {collection, onSnapshot} from "firebase/firestore";

import {Card, Navbar} from "../../components";
import {db} from "../../firebase/firebase";
import {useFirebase} from "../../firebase/AuthContext";

const Home = () => {
  useEffect(() => {
    document.title = "TODO - Home";
  }, []);

  const [customer, setCustomer] = useState(0);
  const [product, setProduct] = useState(0);
  const [order, setOrder] = useState(0);

  const firebase = useFirebase();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users", firebase.authUser, "customers"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach(
          (doc) => {
            list.push({id: doc.id});
            setCustomer(list.length);
          },
          (error) => {
            console.log(error);
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
      collection(db, "users", firebase.authUser, "products"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach(
          (doc) => {
            list.push({id: doc.id});
            setProduct(list.length);
          },
          (error) => {
            console.log(error);
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
      collection(db, "users", firebase.authUser, "orders"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach(
          (doc) => {
            list.push({id: doc.id});
            setOrder(list.length);
          },
          (error) => {
            console.log(error);
          }
        );
      }
    );
    return () => {
      unsubscribe();
    };
  }, [firebase.authUser]);

  return (
    <div className="home">
      <Navbar />
      <Container maxWidth="xl" sx={{marginTop: "20px"}}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <Card
            heading="Total Customers"
            subHeading="total number of customers"
            value={customer}
            linkTo="/customers"
          />
          <Card
            heading="Total Products"
            subHeading="total number of products available"
            value={product}
            linkTo="/products"
          />
          <Card
            heading="Total Orders"
            subHeading="total number of orders available"
            value={order}
            linkTo="/orders"
          />
        </Box>
      </Container>
    </div>
  );
};

export default Home;
