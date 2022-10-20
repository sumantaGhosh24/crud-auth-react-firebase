import {useContext} from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

import "./App.css";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import NotFound from "./pages/not-found/NotFound";
import CustomerList from "./pages/list/CustomerList";
import ProductList from "./pages/list/ProductList";
import OrderList from "./pages/list/OrderList";
import CustomerSingle from "./pages/single/CustomerSingle";
import ProductSingle from "./pages/single/ProductSingle";
import OrderSingle from "./pages/single/OrderSingle";
import CustomerNew from "./pages/new/CustomerNew";
import ProductNew from "./pages/new/ProductNew";
import OrderNew from "./pages/new/OrderNew";
import CustomerUpdate from "./pages/update/CustomerUpdate";
import ProductUpdate from "./pages/update/ProductUpdate";

import {customerInputs, productInputs} from "./formSource";
import {AuthContext} from "./context/AuthContext";

function App() {
  const {currentUser} = useContext(AuthContext);

  console.log("user context", currentUser);

  const RequireAuth = ({children}) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  const GuestAuth = ({children}) => {
    return currentUser ? <Navigate to="/" /> : children;
  };

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route index element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="customers">
              <Route index element={<CustomerList />} />
              <Route path=":customerId" element={<CustomerSingle />} />
              <Route
                path="new"
                element={
                  <CustomerNew
                    inputs={customerInputs}
                    title="Add New Customer"
                  />
                }
              />
              <Route
                path="update/:customerId"
                element={
                  <CustomerUpdate
                    inputs={customerInputs}
                    title="Update Customer"
                  />
                }
              />
            </Route>
            <Route path="products">
              <Route index element={<ProductList />} />
              <Route path=":productId" element={<ProductSingle />} />
              <Route
                path="new"
                element={
                  <ProductNew inputs={productInputs} title="Add New Product" />
                }
              />
              <Route
                path="update/:productId"
                element={
                  <ProductUpdate
                    inputs={productInputs}
                    title="Update Product"
                  />
                }
              />
            </Route>
            <Route path="orders">
              <Route index element={<OrderList />} />
              <Route path=":orderId" element={<OrderSingle />} />
              <Route path="new" element={<OrderNew title="Add New Order" />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* <Routes>
          <Route path="/">
            <Route
              path="login"
              element={
                <GuestAuth>
                  <Login />
                </GuestAuth>
              }
            />
            <Route
              path="register"
              element={
                <GuestAuth>
                  <Register />
                </GuestAuth>
              }
            />
            <Route
              index
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />
            <Route path="users">
              <Route
                index
                element={
                  <RequireAuth>
                    <List />
                  </RequireAuth>
                }
              />
              <Route
                path=":userId"
                element={
                  <RequireAuth>
                    <Single />
                  </RequireAuth>
                }
              />
              <Route
                path="new"
                element={
                  <RequireAuth>
                    <New inputs={userInputs} title="Add New User" />
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="products">
              <Route
                index
                element={
                  <RequireAuth>
                    <List />
                  </RequireAuth>
                }
              />
              <Route
                path=":productId"
                element={
                  <RequireAuth>
                    <Single />
                  </RequireAuth>
                }
              />
              <Route
                path="new"
                element={
                  <RequireAuth>
                    <New inputs={productInputs} title="Add New Product" />
                  </RequireAuth>
                }
              />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
