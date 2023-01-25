import {useContext, useEffect, useState} from "react";
import {Box, Container} from "@mui/system";
import {collection, onSnapshot} from "firebase/firestore";

import Navbar from "../../components/navbar/Navbar";
import PreviewCard from "../../components/card/Card";
import {AuthContext} from "../../context/AuthContext";
import {db} from "../../firebase";

const Home = () => {
  const [customer, setCustomer] = useState(0);
  const [product, setProduct] = useState(0);
  const [order, setOrder] = useState(0);

  const {currentUser} = useContext(AuthContext);

  useEffect(() => {
    document.title = "TODO - Home";
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users", currentUser.uid, "customers"),
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
  }, [currentUser.uid]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users", currentUser.uid, "products"),
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
  }, [currentUser.uid]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users", currentUser.uid, "orders"),
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
  }, [currentUser.uid]);

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
          <PreviewCard
            heading="Total Customers"
            subHeading="total number of customers"
            value={customer}
            linkTo="/customers"
          />
          <PreviewCard
            heading="Total Products"
            subHeading="total number of products available"
            value={product}
            linkTo="/products"
          />
          <PreviewCard
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
