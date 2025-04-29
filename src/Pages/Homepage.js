import React from "react";
import Affordable from "../Components/Affordable";
import "./Homepage.css";
import LowestProduct from "../Components/LowestProduct";

function Homepage() {
  return (
    <div className="homepage">
      <Affordable />
      <LowestProduct></LowestProduct>
    </div>
  );
}

export default Homepage;
