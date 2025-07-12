import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { FaClipboardList, FaTshirt } from "react-icons/fa";
import { MdRemoveShoppingCart } from "react-icons/md";
import { IoMdCart } from "react-icons/io";
import "../../Pages/Home.css";
import { PiGreaterThanBold } from "react-icons/pi";
import Storevisitors from "../../Components/Storevisitors";
import OrderStatistics from "../../Components/OrderStatistics";
import Leaderboard from "../../Components/Leaderboard";
import RecTransaction from "../../Components/RecTransaction";
import VOrderGraph from "./VOrderGraph";
import Weekly from "../../Components/Weekly";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import VDProduct from "./VDProduct";
import { getVendorDashboardOrderApi, getVendorDashboardProductApi } from "../../services/allApi";
import VDOrder from "./VDOrder";

function VendorDashboard() {
  const [dashboardProductData, setDashboardProductData] = useState(null);
  const [dashboardOrderData, setDashboardOrderData] = useState(null);

  useEffect(() => {
    fetchDashboardProductData();
    fetchDashboardOrderData();

  }, []);
  const fetchDashboardProductData = async () => {
    const result = await getVendorDashboardProductApi();
    console.log("dashboard-product", result);
    if (result.success) {
      setDashboardProductData(result.data);
    } else {
      console.error(result.error);
    }
  };
  const fetchDashboardOrderData = async () => {
    const result = await getVendorDashboardOrderApi();
    console.log("dashboard-order", result);
    if (result.success) {
      setDashboardOrderData(result.data);
    } else {
      console.error(result.error);
    }
  };
  const cardsData = [
    {
      title: "All Product",
      count: dashboardProductData?.totalProducts || 0,
      icon: <FaTshirt style={{ color: "#495DD9" }} />,
      color: "#495DD9",
      path: "/vendorproducts",
    },
    {
      title: "Current Orders",
      count: dashboardOrderData?.currentOrders || 0,
      icon: <FaClipboardList style={{ color: "#66BB6A" }} />,
      color: "#66BB6A",
      path: "/vendororders",
    },
    {
      title: "Out of Stock",
      count: dashboardOrderData?.outOfStock || 0,
      icon: <MdRemoveShoppingCart style={{ color: "#FB544B" }} />,
      color: "#FB544B",
      path: "/vendorproducts",
    },
    {
      title: "Limited Stock",
      count: dashboardOrderData?.limitedStock || 0,
      icon: <IoMdCart style={{ color: "#FFA425" }} />,
      color: "#FFA425",
      path: "/vendorproducts",
    },
  ];

  return (
    <div className="p-4 dashboard-container">
      <Row>
        {cardsData.map((card, index) => (
          <Col key={index} md={3} sm={6} className="mb-4">
            <Card className="dashboard-card shadow">
              <Card.Body>
                <div className="dashboard-card-header">
                  <Card.Title className="mb-4 dashboard-card-title">
                    {card.title}
                  </Card.Title>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2 className="dashboard-card-number">{card.count}</h2>
                  <div className="dashboard-card-icon">{card.icon}</div>
                </div>
                <div className="dashboard-card-footer">
                  <Button
                    variant="link"
                    className="view-btn p-0 dashboard-card-view"
                  >
                    <Link
                      to={card.path}
                      className="view-btn p-0 dashboard-card-view"
                    >
                      View{" "}
                      <span className="arrow-icon mt-1 ms-2">
                        <PiGreaterThanBold />
                      </span>
                    </Link>
                    <span className="arrow-icon mt-1 ms-2">
                      <PiGreaterThanBold />
                    </span>
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Row className="mt-5">
        <Col md={12}>
          <VOrderGraph vendordashboardData={dashboardOrderData} />
        </Col>
        {/* <Col md={5}>
          <Storevisitors />
        </Col> */}
      </Row>
      <Row className="mt-5">
        <Col md={6}>
          <VDProduct />
        </Col>
        <Col md={6}>
          <VDOrder />
        </Col>
      </Row>
      {/* <Row className="mt-5">
        <Col md={7}>
          <Weekly />
        </Col>
        <Col md={5}>
          <OrderStatistics></OrderStatistics>
        </Col>
      </Row> */}
      {/* <Row className="mt-5">
        <Col md={12}>
          <Leaderboard />
        </Col>
      </Row> */}
      <Row className="mt-5">
        <Col md={12}>
          <RecTransaction />
        </Col>
      </Row>
    </div>
  );
}

export default VendorDashboard;
