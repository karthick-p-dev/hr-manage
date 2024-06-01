import React, { Fragment } from "react";
import "./App.css";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Sidebar from "./layouts/sidebar/sidebar";
import Login from "./feature/login/Login";
import NoMatch from "./routes/Nomatch";
import ResetPassword from "./feature/login/resetpassword/ResetPassword";
import ChangePassword from "./feature/login/resetpassword/ChangePassword";

function App() {
  const user: any = useSelector((state: any) => state && state.signReducer && state.signReducer.entities);

  return (
    <div className="App">
      <BrowserRouter basename={"/"}>
        {user && user.token ? <Sidebar />
          : <Fragment>
            <div className="wrapper d-flex flex-column min-vh-100 bg-light">
              <div className="body flex-grow-1 px-3">
                <Routes>
                  <Route path='/' element={<Login />} ></Route>
                  <Route path='/password-reset-request' element={<ResetPassword />} ></Route>
                  <Route path='/ChangePassword' element={<ChangePassword />} ></Route>
                  <Route path="/login" element={<Login />}></Route>
                  {/* <Route path="*" element={<NoMatch />}></Route> */}
          </Routes>
          </div></div>
          </Fragment>
        }
      </BrowserRouter>

    </div>
  );
}

export default App;
