import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Form, Modal, Button } from "react-bootstrap";
import "./singleproduct.css";

import {
  deleteVendorApi,
  deleteVendorImageApi,
  getVendorbyID,
  updatevendorapi,
} from "../services/allApi";
import { BASE_URL } from "../services/baseUrl";
import { toast, ToastContainer } from "react-toastify";
import { AiOutlineCloudUpload } from "react-icons/ai";
import VendorProducts from "../Components/VendorProducts";

function VendorProfile() {
  const { id } = useParams();
  const [vendorData, setVendorData] = useState({});
  const [vendorProducts, setVendorProducts] = useState([]);
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountNumber: "",
    accountHolderName: "",
    ifscCode: "",
  });
  const [images, setImages] = useState([null, null, null, null]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  const [formData, setFormData] = useState({
    shopName: "",
    description: "",
    address: "",
    phoneNumber: "",
    location: "",
    landmark: "",
    city: "",
    state: "",
    pinCode: "",
    stock: "",
    storeType: "",
    email: "",
    gstNumber: "",
    ownername: "",
  });

  const [files, setFiles] = useState({
    licence: null,
    certificate: null,
    logo: null,
    passbookImage: null,
  });

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const response = await getVendorbyID(id);

        if (response && response.data) {
          const { vendor, products } = response.data;
          setVendorData(vendor);
          setVendorProducts(products || []);
          
          // Set bank details
          if (vendor.bankDetails) {
            setBankDetails({
              bankName: vendor.bankDetails.bankName || "",
              accountNumber: vendor.bankDetails.accountNumber || "",
              accountHolderName: vendor.bankDetails.accountHolderName || "",
              ifscCode: vendor.bankDetails.ifscCode || "",
            });
          }

          // Set form data
          setFormData({
            shopName: vendor.businessname || "",
            description: vendor.description || "",
            address: vendor.address || "",
            phoneNumber: vendor.number || "",
            location: vendor.businesslocation || "",
            landmark: vendor.businesslandmark || "",
            city: vendor.city || "",
            state: vendor.state || "",
            pinCode: vendor.pincode || "",
            stock: vendor.stock || "",
            storeType: vendor.storetype || "",
            email: vendor.email || "",
            gstNumber: vendor.gstNumber || "",
            ownername: vendor.ownername || "",
          });

          // Set files
          setFiles({
            licence: vendor.license || null,
            certificate: vendor.certificate || null,
            logo: vendor.storelogo || null,
            passbookImage: vendor.passbookImage || null,
          });

          // Set images
          if (vendor.images && vendor.images.length > 0) {
            const imagesArray = [...vendor.images];
            // Fill remaining slots with null if less than 4 images
            while (imagesArray.length < 4) {
              imagesArray.push(null);
            }
            setImages(imagesArray.slice(0, 4));
          }
        }
      } catch (error) {
        console.error("Error fetching vendor data:", error);
        toast.error("Failed to load vendor data");
      }
    };

    if (id) {
      fetchVendorData();
    }
  }, [id]);

  const handleImageChange = (index, event) => {
    if (event.target.files && event.target.files[0]) {
      const newImages = [...images];
      newImages[index] = event.target.files[0]; // Store the file object instead of URL
      setImages(newImages);
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  const handleDeleteModalOpen = () => setShowDeleteModal(true);
  const handleDeleteModalClose = () => setShowDeleteModal(false);

  const handleDeleteConfirm = async () => {
    try {
      await deleteVendorApi(id);
      toast.success("Vendor deleted successfully!", {
        onClose: () => navigate("/managevendors"),
      });
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting vendor:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "Failed to delete vendor. Please try again.";
      toast.error(errorMessage);
    }
  };

  const openDeleteModal = (imageIndex) => {
    setImageToDelete(imageIndex);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBankDetailChange = (e) => {
    const { name, value } = e.target;
    setBankDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (fileType, e) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({
        ...prev,
        [fileType]: e.target.files[0]
      }));
    }
  };

  const handleFileInputClick = (inputId) => {
    document.getElementById(inputId).click();
  };

  const downloadDocument = (docName) => {
    if (docName) {
      window.open(`${BASE_URL}/uploads/${docName}`, '_blank');
    } else {
      toast.warning("No document available to download");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Append all form data
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formDataToSend.append(key, value);
      }
    });

    // Append bank details
    Object.entries(bankDetails).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formDataToSend.append(`bankDetails[${key}]`, value);
      }
    });

    // Append files if they are new (File objects)
    Object.entries(files).forEach(([key, value]) => {
      if (value instanceof File) {
        formDataToSend.append(key, value);
      }
    });

    // Append images
    images.forEach((image, index) => {
      if (image instanceof File) {
        formDataToSend.append(`images`, image);
      }
    });

    try {
      const response = await updatevendorapi(id, formDataToSend);
      if (response.success) {
        toast.success("Vendor updated successfully");
        // Refresh data
        const updatedResponse = await getVendorbyID(id);
        if (updatedResponse && updatedResponse.data) {
          setVendorData(updatedResponse.data.vendor);
          setVendorProducts(updatedResponse.data.products || []);
        }
      } else {
        toast.error(response.error || "Failed to update vendor");
      }
    } catch (err) {
      toast.error(err.message || "An unexpected error occurred");
    }
  };

  const confirmDeleteImage = async () => {
    if (imageToDelete === null || !vendorData.images || !vendorData.images[imageToDelete]) {
      toast.error("No image selected for deletion");
      setIsModalOpen(false);
      return;
    }

    try {
      const response = await deleteVendorImageApi(id, {
        imageName: vendorData.images[imageToDelete]
      });

      if (response.success) {
        toast.success("Image deleted successfully!");
        // Update local state
        const updatedImages = [...vendorData.images];
        updatedImages.splice(imageToDelete, 1);
        setVendorData(prev => ({
          ...prev,
          images: updatedImages
        }));
        // Reset images array
        const newImages = [...images];
        newImages[imageToDelete] = null;
        setImages(newImages);
      } else {
        toast.error(response.error || "Failed to delete image");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the image");
    } finally {
      setIsModalOpen(false);
      setImageToDelete(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setImageToDelete(null);
  };

  return (
    <div className="single-product">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="single-product-title">Vendor Profile Details</h2>
        </Col>
        <Col className="text-end">
          <button
            className="me-2 remove-product-button"
            onClick={handleDeleteModalOpen}
          >
            Remove Vendor
          </button>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          {/* Main Vendor Image or Placeholder */}
          <div className="position-relative single-product-wrapper">
            {vendorData?.images?.[0] || images[0] ? (
              <>
                <img
                  src={
                    vendorData?.images?.[0]
                      ? `${BASE_URL}/uploads/${vendorData.images[0]}`
                      : URL.createObjectURL(images[0])
                  }
                  alt="Vendor Logo"
                  className="single-product-img"
                />
                <i
                  className="fa-solid fa-trash main-image-delete-icon"
                  onClick={() => vendorData?.images?.[0] ? openDeleteModal(0) : handleRemoveImage(0)}
                ></i>
              </>
            ) : (
              <div className="add-image-icon-large">
                +
                <input
                  type="file"
                  accept="image/*"
                  className="image-input"
                  onChange={(event) => handleImageChange(0, event)}
                />
              </div>
            )}
          </div>

          {/* Additional Images (Up to 4) */}
          <Row className="mt-3">
            {[...Array(4)].map((_, index) => (
              <Col key={index} xs={3} className="position-relative">
                <div className="image-square">
                  {vendorData?.images?.[index + 1] || images[index + 1] ? (
                    <>
                      <img
                        src={
                          vendorData?.images?.[index + 1]
                            ? `${BASE_URL}/uploads/${vendorData.images[index + 1]}`
                            : URL.createObjectURL(images[index + 1])
                        }
                        alt={`Additional ${index + 1}`}
                        className="img-fluid added-image"
                      />
                      <i
                        className="fa-solid fa-trash additional-image-delete-icon"
                        onClick={
                          vendorData?.images?.[index + 1]
                            ? () => openDeleteModal(index + 1)
                            : () => handleRemoveImage(index + 1)
                        }
                      ></i>
                    </>
                  ) : (
                    <>
                      <div className="add-image-icon">+</div>
                      <input
                        type="file"
                        accept="image/*"
                        className="image-input"
                        onChange={(event) => handleImageChange(index + 1, event)}
                      />
                    </>
                  )}
                </div>
              </Col>
            ))}
          </Row>
        </Col>

        <Col md={9} className="single-product-right-column">
          <Form onSubmit={handleFormSubmit}>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Shop Name
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Owner Name
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    name="ownername"
                    value={formData.ownername}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Email
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Store Type
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    name="storeType"
                    value={formData.storeType}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    GST Number
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Phone Number
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Description
                  </Form.Label>
                  <Form.Control
                    className="single-product-description"
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Business Location
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Landmark
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    City
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    State
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Pincode
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Address
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <h4 className="mt-4 mb-3">Bank Details</h4>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Bank Name
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    name="bankName"
                    value={bankDetails.bankName}
                    onChange={handleBankDetailChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Account Number
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    name="accountNumber"
                    value={bankDetails.accountNumber}
                    onChange={handleBankDetailChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Account Holder Name
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    name="accountHolderName"
                    value={bankDetails.accountHolderName}
                    onChange={handleBankDetailChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    IFSC Code
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    name="ifscCode"
                    value={bankDetails.ifscCode}
                    onChange={handleBankDetailChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <h4 className="mt-4 mb-3">Documents</h4>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group className="position-relative">
                  <Form.Label className="single-product-form-label">
                    Store Logo
                  </Form.Label>
                  <div className="d-flex align-items-center">
                    <Form.Control
                      className="single-product-form with-icon"
                      type="text"
                      value={files.logo instanceof File ? files.logo.name : (vendorData.storelogo || "No file selected")}
                      readOnly
                    />
                    <Button 
                      variant="link" 
                      onClick={() => downloadDocument(vendorData.storelogo)}
                      disabled={!vendorData.storelogo}
                    >
                      Download
                    </Button>
                    <AiOutlineCloudUpload
                      className="form-icon ms-2"
                      onClick={() => handleFileInputClick("logo-file")}
                    />
                  </div>
                  <input
                    type="file"
                    id="logo-file"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileChange("logo", e)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="position-relative">
                  <Form.Label className="single-product-form-label">
                    License
                  </Form.Label>
                  <div className="d-flex align-items-center">
                    <Form.Control
                      className="single-product-form with-icon"
                      type="text"
                      value={files.licence instanceof File ? files.licence.name : (vendorData.license || "No file selected")}
                      readOnly
                    />
                    <Button 
                      variant="link" 
                      onClick={() => downloadDocument(vendorData.license)}
                      disabled={!vendorData.license}
                    >
                      Download
                    </Button>
                    <AiOutlineCloudUpload
                      className="form-icon ms-2"
                      onClick={() => handleFileInputClick("license-file")}
                    />
                  </div>
                  <input
                    type="file"
                    id="license-file"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileChange("licence", e)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="position-relative">
                  <Form.Label className="single-product-form-label">
                    Passbook
                  </Form.Label>
                  <div className="d-flex align-items-center">
                    <Form.Control
                      className="single-product-form with-icon"
                      type="text"
                      value={files.passbookImage instanceof File ? files.passbookImage.name : (vendorData.passbookImage || "No file selected")}
                      readOnly
                    />
                    <Button 
                      variant="link" 
                      onClick={() => downloadDocument(vendorData.passbookImage)}
                      disabled={!vendorData.passbookImage}
                    >
                      Download
                    </Button>
                    <AiOutlineCloudUpload
                      className="form-icon ms-2"
                      onClick={() => handleFileInputClick("passbook-file")}
                    />
                  </div>
                  <input
                    type="file"
                    id="passbook-file"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileChange("passbookImage", e)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Created At
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    value={new Date(vendorData.createdAt).toLocaleString()}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Updated At
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    value={new Date(vendorData.updatedAt).toLocaleString()}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Average Rating
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    value={vendorData.ratingsAverage || "Not rated yet"}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            <button
              type="submit"
              className="w-25 category-model-add mt-3"
            >
              Update Vendor
            </button>
          </Form>
        </Col>
      </Row>

      <VendorProducts products={vendorProducts} vendorId={id} />

      {/* Delete Image Modal */}
      <Modal show={isModalOpen} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Image Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this image? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteImage}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Vendor Modal */}
      <Modal show={showDeleteModal} onHide={handleDeleteModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title className="category-modal-title">
            Confirm Vendor Deletion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-with-scroll">
          <p className="delete-modal-text">
            Are you sure you want to delete this vendor? This will also remove all associated products. This action cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Row className="w-100">
            <Col>
              <button
                className="w-100 category-model-cancel"
                onClick={handleDeleteModalClose}
              >
                Cancel
              </button>
            </Col>
            <Col>
              <button
                className="w-100 category-model-add"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
}

export default VendorProfile;