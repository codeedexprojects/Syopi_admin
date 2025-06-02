import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Form, Modal, Button } from "react-bootstrap";
import "./singleproduct.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
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
  const [vendorProduct, setVendorProduct] = useState({});

  const [images, setImages] = useState([null, null, null, null]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [imageToDelete, setImageToDelete] = useState(null);

  const [shopName, setShopName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [landmark, setLandMark] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [stock, setStock] = useState("");
  const [storeType, setStoreType] = useState("");
  const [vendorId, setVendorId] = useState("");

  const [licence, setLicence] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [logo, setLogo] = useState(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const response = await getVendorbyID(id);
        console.log("single-vendor",response);

        if (response && response.data) {
          const vendor = response.data.vendor;
          const vendorproduct=response.data.products
          setVendorData(
            vendor
            );
          setVendorProduct(vendorproduct);
          setImages(vendorData.images  || [null, null, null, null])
          setShopName(vendor.businessname || "");
          setDescription(vendor.description || "");
          setEmail(vendor.email || "");
          setAddress(vendor.address || "");
          setPhoneNumber(vendor.number || "");
          setLocation(vendor.businesslocation || "");
          setLandMark(vendor.businesslandmark || "");
          setCity(vendor.city || "");
          setState(vendor.state || "");
          setPinCode(vendor.pincode || "");
          setStock(vendor.stock || "");
          setStoreType(vendor.storetype || "");
          setVendorId(vendor._id);
          setLogo(vendor.storelogo);
          setLicence(vendor.licence);
        } else {
          console.error("Invalid response format:", response);
        }
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };

    if (id) {
      fetchVendorData();
    }
  }, [id]);

  const handleImageChange = (index, event) => {
    if (event.target.files && event.target.files[0]) {
      const newImages = [...images];
      newImages[index] = URL.createObjectURL(event.target.files[0]); 
      setImages(newImages);
    }
  };

  // Remove Uploaded Image
  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages[index] = null; // Remove the selected image
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
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Creating FormData object to send all form data
    const formData = new FormData();

    // Append all text fields (use the updated values here)
    formData.append("ownername", "vendor");
    formData.append("fileType", "vendor");
    formData.append("userType", "admin");
    formData.append("businessname", shopName.trim());
    formData.append("description", description.trim());
    formData.append("address", address.trim());
    formData.append("number", phoneNumber);
    formData.append("businesslocation", location);
    formData.append("businesslandmark", landmark);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("stock", stock);
    formData.append("email", email);
    formData.append("pincode", pinCode);
    formData.append("storetype", storeType);

    // Append all file fields if updated
    if (licence) formData.append("license", licence);
    if (certificate) formData.append("certificate", certificate);
    if (logo) formData.append("storelogo", logo);

    // Append images only if they have been updated
    images.forEach((image) => {
      if (image) {
        formData.append("images", image); // Append each image under "images"
      }
    });

    console.log("FormData being sent:");
    // Log form data for debugging
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // Assuming the vendor ID is available in the component

    // Submit the FormData to update the vendor
    try {
      const response = await updatevendorapi(vendorId, formData);

      if (response.success) {
        toast.success("Vendor updated successfully");
        setImages([null, null, null, null]); // Reset images after successful update
      } else {
        toast.error(response.error || "Failed to update Vendor");
      }
    } catch (err) {
      toast.error(err.message || "An unexpected error occurred");
    }
  };

  const confirmDeleteImage = async () => {
    if (!imageToDelete) {
      console.error("Image name not found.");
      setIsModalOpen(false);
      return;
    }

    // Assuming the `_id` is available in `vendorData`
    const vendorId = vendorData._id;

    try {
      const response = await deleteVendorImageApi(vendorId, {
        imageName: imageToDelete,
      });

      if (response.success) {
        toast.success("Image deleted successfully!");

        // Update the UI after successfully deleting the image
        setVendorData((prevData) => ({
          ...prevData,
          images: prevData.images.filter((image) => image !== imageToDelete), // Remove image by name
        }));
      } else {
        toast.error(
          response.error || "Failed to delete the image. Please try again."
        );
      }
    } catch (error) {
      toast.error("An error occurred while deleting the image.");
    } finally {
      setIsModalOpen(false);
      setImageToDelete(null);
    }
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setImageToDelete(null);
  };
  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      setter(file);
    }
  };

  const handleFileInputClick = (inputId) => {
    document.getElementById(inputId).click();
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
              <img
                src={
                  vendorData?.images?.[0]
                    ? `${BASE_URL}/uploads/${vendorData.images[0]}`
                    : images[0]
                }
                alt="Vendor Logo"
                className="single-product-img"
              />
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
            {vendorData?.images?.[0] ? (
              <i
                className="fa-solid fa-trash main-image-delete-icon"
                onClick={() => openDeleteModal(0)}
              ></i>
            ) : (
              images[0] && (
                <i
                  className="fa-solid fa-trash main-image-delete-icon"
                  onClick={() => handleRemoveImage(0)}
                ></i>
              )
            )}
          </div>

          {/* Additional Images (Up to 4) */}
          <Row className="mt-3">
            {[...Array(4)].map((_, index) => (
              <Col key={index} xs={3} className="position-relative">
                <div className="image-square">
                  {vendorData?.images?.[index + 1] || images[index + 1] ? (
                    <img
                      src={
                        vendorData?.images?.[index + 1]
                          ? `${BASE_URL}/uploads/${
                              vendorData.images[index + 1]
                            }`
                          : images[index + 1]
                      }
                      alt={`AdditionalImage`}
                      className="img-fluid added-image"
                    />
                  ) : (
                    <>
                      <div className="add-image-icon">+</div>
                      <input
                        type="file"
                        accept="image/*"
                        className="image-input"
                        onChange={(event) =>
                          handleImageChange(index + 1, event)
                        }
                      />
                    </>
                  )}
                  {(vendorData?.images?.[index + 1] || images[index + 1]) && (
                    <i
                      className="fa-solid fa-trash additional-image-delete-icon"
                      onClick={
                        vendorData?.images?.[index + 1]
                          ? () => openDeleteModal(index + 1)
                          : () => handleRemoveImage(index + 1)
                      }
                    ></i>
                  )}
                </div>
              </Col>
            ))}
          </Row>
        </Col>

        <Col md={9} className="single-product-right-column">
          <Form>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Shop Name
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Specials cut women's top wear"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Type
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Enter store type"
                    value={storeType}
                    onChange={(e) => setStoreType(e.target.value)}
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
                    type="text"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    placeholder="Enter description"
                    value={description || ""}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    location
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Enter Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
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
                    placeholder="5858588887"
                    value={landmark}
                    onChange={(e) => setLandMark(e.target.value)}
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
                    placeholder="Enter City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
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
                    placeholder="Enter Address"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
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
                    placeholder="5858588887"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Address
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Enter Address"
                    value={address || ""}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Phone No
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="5858588887"
                    value={phoneNumber || ""}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group className="position-relative">
                  <Form.Label className="single-product-form-label">
                    Logo
                  </Form.Label>
                  <Form.Control
                    id="logo"
                    className="single-product-form with-icon"
                    type="text"
                    placeholder="Click to upload a file"
                    value={logo}
                    onClick={() => handleFileInputClick("logo-file")}
                  />
                  <input
                    type="file"
                    id="logo-file"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileChange(e, setLogo)}
                  />
                  <AiOutlineCloudUpload
                    className="form-icon"
                    onClick={() => handleFileInputClick("logo-file")}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="position-relative">
                  <Form.Label className="single-product-form-label">
                    License
                  </Form.Label>
                  <Form.Control
                    id="license"
                    className="single-product-form with-icon"
                    type="text"
                    placeholder="Click to upload a file"
                    value={licence}
                    onClick={() => handleFileInputClick("license-file")}
                  />
                  <input
                    type="file"
                    id="license-file"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileChange(e, setLicence)}
                  />
                  <AiOutlineCloudUpload
                    className="form-icon"
                    onClick={() => handleFileInputClick("license-file")}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="position-relative">
                  <Form.Label className="single-product-form-label">
                    Certificates
                  </Form.Label>
                  <Form.Control
                    id="certificates"
                    className="single-product-form with-icon"
                    type="text"
                    placeholder="Click to upload a file"
                    value={certificate ? certificate.name : ""}
                    readOnly
                    onClick={() => handleFileInputClick("certificate-file")}
                  />
                  <input
                    type="file"
                    id="certificates-file"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileChange(e, setCertificate)}
                  />
                  <AiOutlineCloudUpload
                    className="form-icon"
                    onClick={() => handleFileInputClick("certificate-file")}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Stock
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Enter stock quantity"
                    value={stock || ""}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={9}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Form.Group>
                    <Form.Label className="single-product-form-label">
                      Since
                    </Form.Label>
                    <div className="input-with-icon">
                      <DateTimePicker
                        viewRenderers={{
                          hours: renderTimeViewClock,
                          minutes: renderTimeViewClock,
                          seconds: renderTimeViewClock,
                        }}
                        value={vendorData.since || null}
                        className="single-product-form datetime-picker"
                      />
                    </div>
                  </Form.Group>
                </LocalizationProvider>
              </Col>
            </Row>
          </Form>
          <button
            onClick={handleFormSubmit}
            className="w-25 category-model-add mt-3"
          >
            Edit
          </button>
        </Col>
      </Row>
    <VendorProducts product={vendorProduct}/>
      <Modal show={isModalOpen} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this image? This action cannot be
          undone.
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
      <Modal show={showDeleteModal} onHide={handleDeleteModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title className="category-modal-title">
            Confirm Deletion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-with-scroll">
          <p className="delete-modal-text">
            Are you sure you want to delete this vendor? This action cannot be
            undone.
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
      <ToastContainer></ToastContainer>
    </div>
  );
}

export default VendorProfile;
