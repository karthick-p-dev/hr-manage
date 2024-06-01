import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthRoute = () => {
  // const user : any = useSelector((state: any) => state);
  // const auth = null;
  const user : any = useSelector((state: any) => state && state.signReducer && state.signReducer.entities);
  const auth = user.token;
  const location = useLocation();

  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  return (auth || localStorage.getItem("UserToken")) ? <Outlet /> : <Navigate to="/login" state={{ from: location }} />;
};
export default AuthRoute;
