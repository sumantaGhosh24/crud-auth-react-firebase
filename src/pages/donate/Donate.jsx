import React, {useState, useEffect, useContext} from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import {Paid} from "@mui/icons-material";
import {v4 as uuidv4} from "uuid";

import {AuthContext} from "../../context/AuthContext";
import {db} from "../../firebase";
import Navbar from "../../components/navbar/Navbar";
import {RAZORPAY_KEY, RAZORPAY_KEY_SECRET} from "../../config";

const Donate = () => {
  const [rows, setRows] = useState([]);
  const [user, setUser] = useState([]);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const {currentUser} = useContext(AuthContext);

  useEffect(() => {
    document.title = "TODO - Donate";
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users", currentUser.uid, "donations"),
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
      }
    );
    return () => {
      unsubscribe();
    };
  }, [currentUser.uid]);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
      setUser(doc.data());
    });
    return () => {
      unsubscribe();
    };
  }, [currentUser.uid]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount === "") {
      alert("Please enter amount");
    } else {
      var options = {
        key: RAZORPAY_KEY,
        key_secret: RAZORPAY_KEY_SECRET,
        amount: amount * 100,
        currency: "INR",
        name: "TODO",
        description: "donate to todo application developer",
        handler: async function (response) {
          const donationId = uuidv4();
          try {
            await setDoc(
              doc(db, "users", currentUser.uid, "donations", donationId),
              {
                payment_id: response.razorpay_payment_id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                amount: amount,
                message: message,
                timestamp: serverTimestamp(),
              }
            );
            setAmount("");
            setMessage("");
            alert("donation successful.");
          } catch (error) {
            setError(error.message);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        notes: {
          address: "TODO office",
        },
        theme: {
          color: "#1976D2",
        },
      };
      var pay = new window.Razorpay(options);
      pay.on("payment.failed", function (response) {
        setError(`${response.error.code} : ${response.error.description}`);
      });

      pay.open();
    }
  };

  return (
    <>
      <Navbar />
      <Container
        maxWidth="xl"
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 5,
          marginBottom: 5,
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            width: "80%",
            backgroundColor: "#fff",
            borderRadius: "7px",
            boxShadow: "6px 10px 21px -8px rgba(0,0,0,.66)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            padding: 3,
          }}
        >
          <Typography variant="h3" mt={2} sx={{marginBottom: "20px"}}>
            Donate to TODO developer
          </Typography>
          <form onSubmit={handleSubmit} style={{width: "80%"}}>
            <Box sx={{marginBottom: 2}}>
              <TextField
                type="text"
                label="Enter donation amount"
                onChange={(e) => setAmount(e.target.value)}
                sx={{width: "100%"}}
                value={amount}
              />
            </Box>
            <Box sx={{marginBottom: 2}}>
              <TextField
                type="text"
                label="Enter your message"
                onChange={(e) => setMessage(e.target.value)}
                sx={{width: "100%"}}
                value={message}
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Paid />}
              type="submit"
              size="large"
            >
              Donate Developer
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
        <Typography variant="h4" textAlign="center" sx={{marginTop: 5}}>
          Your Previous Donations
        </Typography>
        <TableContainer component={Paper} sx={{marginTop: "50px"}}>
          {rows.length === 0 ? (
            <Typography
              variant="h4"
              textAlign="center"
              sx={{marginTop: 5, marginBottom: 5}}
            >
              You don't have any donations yet!
            </Typography>
          ) : (
            <Table sx={{minWidth: 650}} aria-label="donations table">
              <TableHead>
                <TableRow>
                  <TableCell>Payment ID</TableCell>
                  <TableCell align="right">Name</TableCell>
                  <TableCell align="right">Email</TableCell>
                  <TableCell align="right">Phone</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Message</TableCell>
                  <TableCell align="right">Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{"&:last-child td, &:last-child th": {border: 0}}}
                  >
                    <TableCell component="th" scope="row">
                      {row.payment_id}
                    </TableCell>
                    <TableCell align="right">{row.name}</TableCell>
                    <TableCell align="right">{row.email}</TableCell>
                    <TableCell align="right">{row.phone}</TableCell>
                    <TableCell align="right">{row.amount}</TableCell>
                    <TableCell align="right">{row.message}</TableCell>
                    <TableCell align="right">
                      {row.timestamp.toDate().toDateString()}
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

export default Donate;
