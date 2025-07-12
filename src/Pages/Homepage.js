import React, { useState } from "react";
import Affordable from "../Components/Affordable";
import LowestProduct from "../Components/LowestProduct";
import TopPickProduct from "../Components/ToppickProduct";
import TopsalesProduct from "../Components/TopsalesProduct";
import RefferOffer from "../Components/RefferOffer";
import BrandCarousel from "./BrandCarousel";
import Carousel from "./Carousel";
import CategoryCarousel from "./CategoryCarousel";
import "./Homepage.css";

function Homepage() {
  const [activeSection, setActiveSection] = useState("affordable");
  const [activeCarousel, setActiveCarousel] = useState("brand");

  const renderCarouselSection = () => {
    switch (activeCarousel) {
      case "brand":
        return <BrandCarousel />;
      case "main":
        return <Carousel />;
      case "category":
        return <CategoryCarousel />;
      default:
        return null;
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "affordable":
        return <Affordable />;
      case "lowest":
        return <LowestProduct />;
      case "topPick":
        return <TopPickProduct />;
      case "topSales":
        return <TopsalesProduct />;
      case "refer":
        return <RefferOffer />;
      case "carousel":
        return (
          <div>
            <div className="sub-nav-buttons">
              <button
                className={activeCarousel === "brand" ? "active" : ""}
                onClick={() => setActiveCarousel("brand")}
              >
                Brand Carousel
              </button>
              <button
                className={activeCarousel === "main" ? "active" : ""}
                onClick={() => setActiveCarousel("main")}
              >
                Main Carousel
              </button>
              <button
                className={activeCarousel === "category" ? "active" : ""}
                onClick={() => setActiveCarousel("category")}
              >
                Category Carousel
              </button>
            </div>
            <div className="carousel-content">{renderCarouselSection()}</div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="homepage">
      <div className="nav-buttons">
        <button
          className={activeSection === "affordable" ? "active" : ""}
          onClick={() => setActiveSection("affordable")}
        >
          Affordable
        </button>
        <button
          className={activeSection === "lowest" ? "active" : ""}
          onClick={() => setActiveSection("lowest")}
        >
          Lowest Product
        </button>
        <button
          className={activeSection === "topPick" ? "active" : ""}
          onClick={() => setActiveSection("topPick")}
        >
          Top Pick
        </button>
        <button
          className={activeSection === "topSales" ? "active" : ""}
          onClick={() => setActiveSection("topSales")}
        >
          Top Sales
        </button>
        <button
          className={activeSection === "refer" ? "active" : ""}
          onClick={() => setActiveSection("refer")}
        >
          Refer Offer
        </button>
        <button
          className={activeSection === "carousel" ? "active" : ""}
          onClick={() => setActiveSection("carousel")}
        >
          Carousel
        </button>
      </div>

      <div className="section-content2">{renderSection()}</div>
    </div>
  );
}

export default Homepage;
