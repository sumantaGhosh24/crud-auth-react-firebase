import {useContext} from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

import "./App.css";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Home from "./pages/home/Home";
import NotFound from "./pages/not-found/NotFound";
import CustomerList from "./pages/list/CustomerList";
import ProductList from "./pages/list/ProductList";
import CustomerSingle from "./pages/single/CustomerSingle";
import ProductSingle from "./pages/single/ProductSingle";
import CustomerNew from "./pages/new/CustomerNew";
import ProductNew from "./pages/new/ProductNew";
import CustomerUpdate from "./pages/update/CustomerUpdate";
import ProductUpdate from "./pages/update/ProductUpdate";

import {customerInputs, productInputs} from "./formSource";
import {AuthContext} from "./context/AuthContext";

function App() {
  const {currentUser} = useContext(AuthContext);

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
                  <Register />{" "}
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
            <Route path="customers">
              <Route
                index
                element={
                  <RequireAuth>
                    <CustomerList />
                  </RequireAuth>
                }
              />
              <Route
                path=":customerId"
                element={
                  <RequireAuth>
                    <CustomerSingle />
                  </RequireAuth>
                }
              />
              <Route
                path="new"
                element={
                  <RequireAuth>
                    <CustomerNew inputs={customerInputs} />
                  </RequireAuth>
                }
              />
              <Route
                path="update/:customerId"
                element={
                  <RequireAuth>
                    <CustomerUpdate />
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="products">
              <Route
                index
                element={
                  <RequireAuth>
                    <ProductList />
                  </RequireAuth>
                }
              />
              <Route
                path=":productId"
                element={
                  <RequireAuth>
                    <ProductSingle />
                  </RequireAuth>
                }
              />
              <Route
                path="new"
                element={
                  <RequireAuth>
                    <ProductNew inputs={productInputs} />
                  </RequireAuth>
                }
              />
              <Route
                path="update/:productId"
                element={
                  <RequireAuth>
                    <ProductUpdate />
                  </RequireAuth>
                }
              />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
