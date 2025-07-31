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
import dayjs from 'dayjs';

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
  // const [stock, setStock] = useState("");
  const [storeType, setStoreType] = useState("");
  const [password, setPassword] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [sinceDate, setSinceDate] = useState(dayjs()); // Add this state

  const [license, setLicense] = useState(null);
  const [logo, setLogo] = useState(null);
  const [passbookImage, setPassbookImage] = useState(null);
  const [email, setEmail] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Enhanced validation
    if (images.every((image) => !image)) {
      toast.error("At least one image is required");
      return;
    }

    // Required field validation
    if (!shopName.trim()) {
      toast.error("Shop name is required");
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Valid email is required");
      return;
    }

    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
      toast.error("Valid 10-digit phone number is required");
      return;
    }

    if (!pinCode || !/^\d{6}$/.test(pinCode)) {
      toast.error("Valid 6-digit pincode is required");
      return;
    }

    // GST validation - should be 15 characters with specific format
    if (gstNumber && !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/.test(gstNumber)) {
      toast.error("Invalid GST number format");
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

    if (!/^[A-Za-z]{4}0\d{6}$/.test(ifscCode)) {
      toast.error("IFSC code format: 4 letters + 0 + 6 digits (e.g., SBIN0001234)");
      return;
    }

    const formData = new FormData();

    // Append all text fields with validation
    formData.append("ownername", "vendor");
    formData.append("fileType", "vendor");
    formData.append("userType", "admin");
    formData.append("businessname", shopName.trim());
    formData.append("description", description.trim());
    formData.append("address", address.trim());
    formData.append("number", phoneNumber.trim());
    formData.append("businesslocation", location.trim());
    formData.append("businesslandmark", landmark.trim());
    formData.append("city", city.trim());
    // formData.append("stock", stock.toString());
    formData.append("state", state.trim());
    formData.append("email", email.trim().toLowerCase());
    formData.append("pincode", pinCode.trim());
    formData.append("storetype", storeType.trim());
    formData.append("password", password);
    
    // Add the since date
    if (sinceDate) {
      formData.append("since", sinceDate.toISOString());
    }
    
    // Only append GST if provided
    if (gstNumber.trim()) {
      formData.append("gstNumber", gstNumber.trim().toUpperCase());
    }
    
    // Bank details as JSON
    formData.append("bankDetails", JSON.stringify({
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
      accountHolderName: accountHolderName.trim(),
      ifscCode: ifscCode.trim().toUpperCase()
    }));
    
    // Append files
    if (license) formData.append("license", license);
    if (logo) formData.append("storelogo", logo);
    if (passbookImage) formData.append("passbookImage", passbookImage);

    // Add images
    images.forEach((image) => {
      if (image) {
        formData.append("images", image);
      }
    });

 
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await createVendorApi(formData);

      if (response.success) {
        toast.success("Vendor created successfully");
        // Reset form
        setImages([null, null, null, null]);
        setShopName("");
        setDescription("");
        setAddress("");
        setPhoneNumber("");
        setLocation("");
        setLandMark("");
        setCity("");
        setState("");
        setPinCode("");
        // setStock("");
        setStoreType("");
        setPassword("");
        setBankName("");
        setAccountNumber("");
        setAccountHolderName("");
        setIfscCode("");
        setGstNumber("");
        setEmail("");
        setLicense(null);
        setLogo(null);
        setPassbookImage(null);
        setSinceDate(dayjs());

        navigate("/managevendors");
      } else {
        toast.error(response.error || "Failed to create Vendor");
      }
    } catch (err) {
      console.error("API Error:", err);
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
      updatedImages[0] = selectedImage;
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
                    Shop Name *
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Enter shop name"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    required
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
                    Email *
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                    Location
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
                    placeholder="Enter Landmark"
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
                    placeholder="Enter city"
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
                    placeholder="Enter state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Pincode *
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Enter 6-digit pincode"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    required
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
                    Phone No *
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Enter 10-digit phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    maxLength={10}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    GST Number (Optional)
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Enter GST Number (15 characters)"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                    maxLength={15}
                  />
                  <Form.Text className="text-muted">
                    Format: 22AAAAA0000A1Z5 (Optional)
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="position-relative">
                  <Form.Label className="single-product-form-label">
                    Passbook Image
                  </Form.Label>
                  <Form.Control
                    id="passbook"
                    className="single-product-form with-icon"
                    type="text"
                    placeholder="Click to upload passbook image"
                    value={passbookImage ? passbookImage.name : ""}
                    readOnly
                    onClick={() => handleFileInputClick("passbook-file")}
                  />
                  <input
                    type="file"
                    id="passbook-file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileChange(e, setPassbookImage)}
                  />
                  <AiOutlineCloudUpload
                    className="form-icon"
                    onClick={() => handleFileInputClick("passbook-file")}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
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
              <Col md={6}>
                <Form.Group className="position-relative">
                  <Form.Label className="single-product-form-label">
                    License
                  </Form.Label>
                  <Form.Control
                    id="license"
                    className="single-product-form with-icon"
                    type="text"
                    placeholder="Click to upload a file"
                    value={license ? license.name : ""}
                    readOnly
                    onClick={() => handleFileInputClick("license-file")}
                  />
                  <input
                    type="file"
                    id="license-file"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileChange(e, setLicense)}
                  />
                  <AiOutlineCloudUpload
                    className="form-icon"
                    onClick={() => handleFileInputClick("license-file")}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Bank Name *
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Enter bank name"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Account Number *
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Enter account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Account Holder *
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Enter account holder name"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    IFSC Code *
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="e.g., SBIN0001234"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    maxLength={11}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              {/* <Col md={3}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Stock
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="number"
                    placeholder="Enter stock quantity"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    min="0"
                  />
                </Form.Group>
              </Col> */}
              <Col md={5}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Form.Group>
                    <Form.Label className="single-product-form-label">
                      Since
                    </Form.Label>
                    <div className="input-with-icon">
                      <DateTimePicker
                        value={sinceDate}
                        onChange={(newValue) => setSinceDate(newValue)}
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
                    Password *
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
          <button
            className="w-25 category-model-add mt-3"
            onClick={handleFormSubmit}
          >
            Add Vendor
          </button>
        </Col>
      </Row>
      <ToastContainer />
    </div>
  );
}

export default Addvendors;