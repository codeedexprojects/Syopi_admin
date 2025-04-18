import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const TokenExpiredModal = ({ show, onHide }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        onHide();
        navigate("/login"); // Redirect to login page
    };

    return (
        <Modal show={show} onHide={handleLogout} centered>
            <Modal.Header closeButton>
                <Modal.Title>Session Expired</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Your session has expired. Please log in again to continue.
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleLogout}>
                    Login Again
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TokenExpiredModal;
