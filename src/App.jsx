import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

import "./App.css";
import {useFirebase} from "./firebase/AuthContext";
import {
  CustomerList,
  CustomerNew,
  CustomerSingle,
  CustomerUpdate,
  Donate,
  Home,
  Login,
  NotFound,
  OrderList,
  OrderNew,
  ProductList,
  ProductNew,
  ProductSingle,
  ProductUpdate,
  Register,
} from "./pages";
import {customerInputs, productInputs} from "./data/formSource";

function App() {
  const firebase = useFirebase();

  const RequireAuth = ({children}) => {
    return firebase.authUser ? children : <Navigate to="/login" />;
  };

  const GuestAuth = ({children}) => {
    return firebase.authUser ? <Navigate to="/" /> : children;
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
            <Route path="orders">
              <Route
                index
                element={
                  <RequireAuth>
                    <OrderList />
                  </RequireAuth>
                }
              />
              <Route
                path="new"
                element={
                  <RequireAuth>
                    <OrderNew />
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="/donate" element={<Donate />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
