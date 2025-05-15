import React, { useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import "./singleproduct.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { createVendorApi } from "../services/allApi";
import { toast, ToastContainer } from "react-toastify";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

function Addvendors() {
  const [images, setImages] = useState([null, null, null, null]);
  const navigate = useNavigate();

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
  const [password, setPassword] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [ifscCode, setIfscCode] = useState("");

  const [licence, setLicence] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [logo, setLogo] = useState(null);
  const [email, setEmail] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Check if at least one image is selected
    if (images.every((image) => !image)) {
      toast.error("At least one image is required");
      return;
    }

    if (!bankName || !accountNumber || !accountHolderName || !ifscCode) {
      toast.error("All bank details are required");
      return;
    }

    if (!/^\d{9,18}$/.test(accountNumber)) {
      toast.error("Account number must be 9-18 digits");
      return;
    }

    if (!/^[A-Za-z]{4}\d{7}$/.test(ifscCode)) {
      toast.error("IFSC code must be 4 letters followed by 7 digits");
      return;
    }

    // Creating FormData object to send all form data
    const formData = new FormData();

    // Append all text fields
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
    formData.append("stock", stock);
    formData.append("state", state);
    formData.append("email", email);
    formData.append("pincode", pinCode);
    formData.append("storetype", storeType);
    formData.append("password", password);
    formData.append("bankDetails", JSON.stringify({
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
      accountHolderName: accountHolderName.trim(),
      ifscCode: ifscCode.trim().toUpperCase()
    }));
    // Append all file fields
    if (licence) formData.append("license", licence);
    // if (certificate) formData.append("certificate", certificate);
    if (logo) formData.append("storelogo", logo);

    images.forEach((image) => {
      if (image) {
        formData.append("images", image);
      }
    });

    console.log("FormData being sent:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await createVendorApi(formData);

      if (response.success) {
        toast.success("Vendor created successfully");
        setImages([null, null, null, null]); // Reset images after successful submission

        navigate("/managevendors");
      } else {
        toast.error(response.error || "Failed to create Vendor");
      }
    } catch (err) {
      toast.error(err.message || "An unexpected error occurred");
    }
  };

  const handleImageChange = (index, event) => {
    const newImages = [...images];
    newImages[index] = event.target.files[0];
    setImages(newImages);
  };

  const handleSelectImage = (index) => {
    const selectedImage = images[index];
    if (selectedImage && images[0] !== selectedImage) {
      const updatedImages = [...images];
      updatedImages[0] = selectedImage; // Set selected small image as the large one
      setImages(updatedImages);
    }
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
    <div className=" single-product">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="single-product-title">Vendor Profile Details</h2>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <div className="position-relative">
            <div className="image-square large">
              {images[0] ? (
                <img
                  src={URL.createObjectURL(images[0])}
                  alt="Selected Product"
                  className="img-fluid added-image"
                />
              ) : (
                <div className="add-image-icon">+</div>
              )}
              <input
                type="file"
                accept="image/*"
                className="image-input"
                onChange={(event) => handleImageChange(0, event)}
              />
            </div>
          </div>
          <Row className="mt-3">
            {images.slice(1).map((image, index) => (
              <Col key={index + 1} xs={3} className="position-relative">
                <div
                  className="image-square small"
                  onClick={() => handleSelectImage(index + 1)}
                >
                  {image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Product ${index + 2}`}
                      className="img-fluid added-image"
                    />
                  ) : (
                    <div className="add-image-icon">+</div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="image-input"
                    onChange={(event) => handleImageChange(index + 1, event)}
                  />
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
                    value={description}
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
                    placeholder="5858588887"
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
                    value={address}
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
                    placeholder="Enter Phone Number"
                    value={phoneNumber}
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
                    value={logo ? logo.name : ""}
                    readOnly
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
                    value={licence ? licence.name : ""}
                    readOnly
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
                    id="certificate-file" 
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
                    Bank Name
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Enter bank name"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Account Number
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Enter account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Account Holder
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Enter account holder name"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    IFSC Code
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Enter IFSC code"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
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
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={5}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Form.Group>
                    <Form.Label className="single-product-form-label">
                      Since
                    </Form.Label>
                    <div className="input-with-icon">
                      <DateTimePicker
                        style={{ border: "none" }}
                        viewRenderers={{
                          hours: renderTimeViewClock,
                          minutes: renderTimeViewClock,
                          seconds: renderTimeViewClock,
                        }}
                        className="single-product-form datetime-picker"
                      />
                    </div>
                  </Form.Group>
                </LocalizationProvider>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    password
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
          <button
            className="w-25 category-model-add mt-3"
            onClick={handleFormSubmit}
          >
            Add
          </button>{" "}
        </Col>
      </Row>
      <ToastContainer></ToastContainer>
    </div>
  );
}

export default Addvendors;
