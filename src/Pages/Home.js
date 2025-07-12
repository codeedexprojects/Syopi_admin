import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { FaClipboardList, FaTshirt } from "react-icons/fa";
import { MdRemoveShoppingCart } from "react-icons/md";
import { IoMdCart } from "react-icons/io";
import "./Home.css";
import { PiGreaterThanBold } from "react-icons/pi";
import Storevisitors from "../Components/Storevisitors";
import OrderGraph from "../Components/OrderGraph";
import Dproducts from "../Components/Dproducts";
import Dorders from "../Components/Dorders";
// import Weekly from "../Components/Weekly";
// import Leaderboard from "../Components/Leaderboard";
import RecTransaction from "../Components/RecTransaction";
import OrderStatistics from "../Components/OrderStatistics";
import {
  getDashboardOrdersContentApi,
  getDashboardProductContentApi,
  getDashboardUserContentApi,
} from "../services/allApi";
import { Link } from "react-router-dom";

function Home() {
  const [dashboardProductData, setDashboardProductData] = useState(null);
  const [dashboardUserData, setDashboardUserData] = useState(null);
  const [dashboardOrderData, setDashboardOrderData] = useState(null);


  useEffect(() => {
    fetchDashboardProductData();
    fetchDashboardUserData();
    fetchDashboardOrderData();
  }, []);
  const fetchDashboardProductData = async () => {
    const result = await getDashboardProductContentApi();
    console.log("dashboard-product", result);

    if (result.success) {
      setDashboardProductData(result.data);
    } else {
      console.error(result.error);
    }
  };

  const fetchDashboardOrderData = async () => {
    const result = await getDashboardOrdersContentApi();
    console.log("dashboard-order", result);

    if (result.success) {
      setDashboardOrderData(result.data);
    } else {
      console.error(result.error);
    }
  };

  const fetchDashboardUserData = async () => {
    const result = await getDashboardUserContentApi();
    console.log("dashboard-user", result);

    if (result.success) {
      setDashboardUserData(result.data);
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
      path: "/products",
    },
    {
      title: "Current Orders",
      count: dashboardOrderData?.currentOrders || 0,
      icon: <FaClipboardList style={{ color: "#66BB6A" }} />,
      color: "#66BB6A",
      path: "/orders",
    },
    {
      title: "Out of Stock",
      count: dashboardOrderData?.outOfStock || 0,
      icon: <MdRemoveShoppingCart style={{ color: "#FB544B" }} />,
      color: "#FB544B",
      path: "/products",
    },
    {
      title: "Limited Stock",
      count: dashboardOrderData?.limitedStock || 0,
      icon: <IoMdCart style={{ color: "#FFA425" }} />,
      color: "#FFA425",
      path: "/products",
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
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Row className="mt-5">
        <Col md={7}>
          <OrderGraph dashboardData={dashboardOrderData} />
        </Col>
      
      </Row>
      <Row className="mt-5">
        <Col md={6}>
          <Dproducts />
        </Col>
        <Col md={6}>
          <Dorders dashboardData={dashboardOrderData}/>
        </Col>
      </Row>
      <Row className="mt-5">
        {/* <Col md={7}>
          <Weekly />
        </Col> */}
        <Col md={12}>
          <OrderStatistics dashboardData={dashboardOrderData}/>
        </Col>
      </Row>
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

export default Home;
