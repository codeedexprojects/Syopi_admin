import React, { useEffect, useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import "./singleproduct.css";
import { FaChevronDown } from "react-icons/fa";
import {
  createProductApi,
  getAllBrandsApi,
  getCategoriesApi,
  getsubcategoryByID,
} from "../services/allApi";
import { toast, ToastContainer } from "react-toastify";
import ColorNamer from "color-namer";

function Addproduct() {
  const [images, setImages] = useState([null, null, null, null]);
  const [color, setColor] = useState("#000000");
  const [colorName, setColorName] = useState("Black");
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [productName, setProductName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedProductType, setSelectedProductType] = useState("");
  const [wholesalePrice, setwholesalePrice] = useState("");
  const [normalPrice, setNormalPrice] = useState("");
  const [soleMaterial, setSoleMaterial] = useState("");
  const [CODAvailable, setCODAvailable] = useState("");
  const [fit, setFit] = useState("");
  const [sleevesType, setSleevesType] = useState("");
  const [length, setLength] = useState("");
  const [netWeight, setNetWeight] = useState("");
  const [isReturnable, setIsReturnable] = useState("");
  const [returnWithinDays, setReturnWithinDays] = useState("");
  const [occasion, setOccasion] = useState("");
  const [material, setMaterial] = useState("");
  const adminID = localStorage.getItem("adminId");

  const [sizeStocks, setSizeStocks] = useState({});
  const [variants, setVariants] = useState([]);

  const [selectedSizes, setSelectedSizes] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await getCategoriesApi();
      if (response.success && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.error(
          "Failed to fetch categories:",
          response.error || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => {
    if (color) {
      try {
        // Get color names from the package
        const names = ColorNamer(color);

        // Use the first name from the 'ntc' list (Name That Color)
        // You could also use names.basic[0].name for more basic names
        setColorName(names.ntc[0].name);
      } catch (error) {
        console.error("Error getting color name:", error);
        setColorName(`Custom (${color})`);
      }
    }
  }, [color]);
  const fetchBrands = async () => {
    try {
      const response = await getAllBrandsApi();
      console.log("brands", response);

      if (response.status === 200) {
        setBrands(response.data);
      } else {
        console.error(
          "Failed to fetch categories:",
          response.error || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchSubCategories = async (categoryId) => {
    try {
      const response = await getsubcategoryByID(categoryId);
      console.log("sub", response);
      console.log("brands", response);

      if (response.success && Array.isArray(response.data)) {
        setSubCategories(response.data);
      } else {
        console.error(
          "Failed to fetch subcategories:",
          response.error || "Unknown error"
        );
        setSubCategories([]); // clear if failed
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error.message);
      setSubCategories([]); // clear on error
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, []);

  const handleCategoryChange = async (e) => {
    const selectedCategoryId = e.target.value;
    setSelectedCategory(selectedCategoryId);

    if (selectedCategoryId) {
      await fetchSubCategories(selectedCategoryId);
    } else {
      setSubCategories([]); // No category selected, so clear subcategories
    }
  };

  const handleSubCategoryChange = (e) => {
    setSelectedSubCategory(e.target.value);
  };
  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!productName || !selectedCategory || !description) {
      toast.error("All fields are required");
      return;
    }

    const formattedVariants = variants.map((variant) => ({
      color: variant.color,
      colorName: variant.colorName,
      price: variant.normalPrice,
      wholesalePrice: variant.wholesalePrice,
      // offerPrice: variant.offerPrice,
      sizes: variant.sizes.map(({ size, stock }) => ({
        size,
        stock,
      })),
    }));

    const variantPayload = JSON.stringify(formattedVariants);

    const features = {
      material: selectedProductType === "Dress" ? material || "" : undefined,
      soleMaterial:
        selectedProductType === "Chappal" ? soleMaterial || "" : undefined,
      netWeight: netWeight || "",
      fit: fit || "",
      sleevesType:
        selectedProductType === "Dress" ? sleevesType || "" : undefined,
      length: length || "",
      occasion: occasion || "",
    };

    const cleanedFeatures = Object.fromEntries(
      Object.entries(features).filter(([_, value]) => value !== undefined)
    );

    const formData = new FormData();
    formData.append("name", productName.trim());
    formData.append("description", description.trim());
    formData.append("category", selectedCategory);
    formData.append("subcategory", selectedSubCategory || "");
    formData.append("brand", selectedBrand || "");
    formData.append("wholesalePrice", wholesalePrice || "");
    formData.append("normalPrice", normalPrice || "");
    formData.append("isReturnable", isReturnable || "false");
    formData.append("CODAvailable", CODAvailable || "false");

    formData.append("returnWithinDays", returnWithinDays || "");

    // formData.append("offerPrice", offerPrice || "");
    // formData.append("stock", stock || "");
    // formData.append("coupon", coupon || "");
    formData.append("type", occasion || "");
    // formData.append("offer", offer || "");
    formData.append("productType", selectedProductType || "");
    formData.append("material", material || "");
    formData.append("owner", adminID || "");
    formData.append("fileType", "product");
    formData.append("userType", "admin");
    formData.append("variants", variantPayload);
    formData.append("features", JSON.stringify(cleanedFeatures));

    // Append all images
    images.forEach((image) => {
      if (image) {
        formData.append("images", image); // Append each image
      }
    });

    console.log("FormData being sent:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      // Send API request
      const response = await createProductApi(formData);
      console.log(response);

      if (response.success) {
        toast.success("Product created successfully");
      } else {
        toast.error(response.error || "Failed to create product");
      }
    } catch (err) {
      toast.error(err.message || "An unexpected error occurred");
    }
  };

  const handleAddVariant = () => {
    if (!color || !colorName || !Object.keys(sizeStocks).length) {
      alert("Please fill in all required fields.");
      return;
    }

    // Map sizeStocks object into an array of sizes
    const formattedSizes = Object.entries(sizeStocks).map(([size, stock]) => ({
      size,
      stock: Number(stock), // Ensure stock is a number
    }));

    // Calculate the total stock
    const totalStock = formattedSizes.reduce(
      (sum, { stock }) => sum + stock,
      0
    );

    const newVariant = {
      color,
      colorName,
      wholesalePrice,
      normalPrice,
      // offerPrice,
      stock: totalStock,
      sizes: formattedSizes,
    };

    setVariants((prevVariants) => [...prevVariants, newVariant]);

    // Clear fields
    setColor("");
    setColor("#ffffff");
    setColorName("");
    setwholesalePrice("");
    setNormalPrice("");
    // setOfferPrice("");
    setSizeStocks({});
  };

  const handleSizeSelection = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes((prev) => prev.filter((s) => s !== size));
      setSizeStocks((prev) => {
        const newSizeStocks = { ...prev };
        delete newSizeStocks[size];
        return newSizeStocks;
      });
    } else {
      setSelectedSizes((prev) => [...prev, size]);
    }
  };

  const handleStockChange = (size, stock) => {
    setSizeStocks((prev) => ({ ...prev, [size]: stock }));
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

  return (
    <div className=" single-product">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="single-product-title">Add Product</h2>
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
                    Product Name
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Enter product name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Category
                  </Form.Label>
                  <div className="dropdown-wrapper">
                    <Form.Control
                      className="single-product-form custom-dropdown"
                      as="select"
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      aria-label="Select category"
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </Form.Control>
                    <FaChevronDown className="dropdown-icon" />
                  </div>
                </Form.Group>
              </Col>
              {/* <Col md={4}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Occasion
                  </Form.Label>
                  <div className="dropdown-wrapper">
                    <Form.Control
                      className="single-product-form custom-dropdown"
                      as="select"
                      defaultValue=""
                      aria-label="Select Occasion"
                    >
                      <option value="">Select Occasion</option>
                      <option value="Casual">Casual</option>
                      <option value="Formal">Formal</option>
                    </Form.Control>
                    <FaChevronDown className="dropdown-icon" />
                  </div>
                </Form.Group>
              </Col> */}
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
                    Sub Category
                  </Form.Label>
                  <div className="dropdown-wrapper">
                    <Form.Control
                      className="single-product-form custom-dropdown"
                      as="select"
                      value={selectedSubCategory}
                      onChange={handleSubCategoryChange}
                      aria-label="Select subcategory"
                    >
                      <option value="">Select sub category</option>
                      {subcategories.map((subcategory) => (
                        <option key={subcategory._id} value={subcategory._id}>
                          {subcategory.name}
                        </option>
                      ))}
                    </Form.Control>
                    <FaChevronDown className="dropdown-icon" />
                  </div>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Brand
                  </Form.Label>
                  <div className="dropdown-wrapper">
                    <Form.Control
                      className="single-product-form custom-dropdown"
                      as="select"
                      value={selectedBrand}
                      onChange={handleBrandChange}
                      aria-label="Select brand"
                    >
                      <option value="">Select Brand</option>
                      {brands?.map?.((brand) => (
                        <option key={brand._id} value={brand._id}>
                          {brand.name}
                        </option>
                      )) || <option disabled>No brands available</option>}
                    </Form.Control>
                    <FaChevronDown className="dropdown-icon" />
                  </div>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Product Type
                  </Form.Label>
                  <div className="dropdown-wrapper">
                    <Form.Control
                      className="single-product-form custom-dropdown"
                      as="select"
                      aria-label="Select Product Type"
                      value={selectedProductType}
                      onChange={(e) => setSelectedProductType(e.target.value)}
                    >
                      <option value="">Select Product Type</option>
                      <option value="Dress">Dress</option>
                      <option value="Chappal">Chappal</option>
                    </Form.Control>
                    <FaChevronDown className="dropdown-icon" />
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Form.Group>
                <Form.Label className="single-product-form-label">
                  Color
                </Form.Label>
                <div className="color-picker-container d-flex">
                  <Form.Control
                    className="single-product-form w-auto"
                    type="text"
                    disabled
                    placeholder="Color Code"
                    value={color}
                    onChange={(e) => {
                      setColor(e.target.value);
                    }}
                  />

                  <Form.Control
                    className="single-product-form mx-2"
                    type="color"
                    value={color}
                    style={{ padding: "5px" }}
                    onChange={(e) => {
                      const selectedColor = e.target.value;
                      setColor(selectedColor);
                    }}
                  />

                  <Form.Control
                    className="single-product-form w-auto"
                    type="text"
                    placeholder="Enter color name"
                    value={colorName}
                    onChange={(e) => {
                      setColorName(e.target.value);
                    }}
                  />
                </div>
              </Form.Group>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Wholesale Price
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Rs."
                    value={wholesalePrice}
                    onChange={(e) => setwholesalePrice(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Normal Price
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Rs."
                    value={normalPrice}
                    onChange={(e) => setNormalPrice(e.target.value)}
                  />
                </Form.Group>
              </Col>
              {/* <Col md={4}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Offer Price
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Rs."
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                  />
                </Form.Group>
              </Col> */}
            </Row>
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Size and Stock
                  </Form.Label>
                  <div className="size-selection">
                    {["S", "M", "L", "XL", "XXL", "XXXL"].map((size) => (
                      <div key={size} className="size-stock-group">
                        <label className="size-checkbox-label">
                          <input
                            type="checkbox"
                            className="size-checkbox"
                            checked={selectedSizes.includes(size)}
                            onChange={() => handleSizeSelection(size)}
                          />
                          <span className="size-label">{size}</span>
                        </label>
                        {selectedSizes.includes(size) && (
                          <Form.Control
                            type="number"
                            className="size-stock-input single-product-form"
                            placeholder={`Stock for ${size}`}
                            value={sizeStocks[size] || ""}
                            onChange={(e) =>
                              handleStockChange(size, e.target.value)
                            }
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <button
              type="button"
              onClick={handleAddVariant}
              className="w-25 category-model-add"
            >
              Add Variant
            </button>
            <div className="mt-4">
              <p className="single-product-form-label">Variants</p>
              {variants.map((variant, index) => (
                <div
                  key={index}
                  className="variant-card p-4 border rounded shadow-sm mb-4"
                  style={{
                    backgroundColor: "#f9f9f9",
                    borderLeft: "5px solid #000000",
                    borderRadius: "10px",
                  }}
                >
                  <p
                    className="mb-2"
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#000000",
                    }}
                  >
                    <span>Color:</span>{" "}
                    <span>
                      {variant.color}{" "}
                      <span
                        style={{
                          display: "inline-block",
                          width: "20px",
                          height: "20px",
                          backgroundColor: variant.color,
                          borderRadius: "50%",
                          marginLeft: "12px",
                        }}
                      ></span>
                    </span>
                  </p>
                  <p
                    className="mb-2"
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#000000",
                    }}
                  >
                    <span>Stock:</span>{" "}
                    <span style={{ fontWeight: "400", color: "#333333" }}>
                      {variant.stock}
                    </span>
                  </p>
                  <p
                    className="mb-2"
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#000000",
                    }}
                  >
                    <span>Sizes:</span>{" "}
                    <span style={{ fontWeight: "400", color: "#333333" }}>
                      {variant.sizes
                        .map(({ size, stock }) => `${size} (Stock: ${stock})`)
                        .join(", ")}
                    </span>
                  </p>

                  <p
                    className="mb-2"
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#000000",
                    }}
                  >
                    <span>Wholesale Price:</span>{" "}
                    <span style={{ fontWeight: "400", color: "#333333" }}>
                      Rs. {variant.wholesalePrice}
                    </span>
                  </p>
                  <p
                    className="mb-2"
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#000000",
                    }}
                  >
                    <span>Normal Price:</span>{" "}
                    <span style={{ fontWeight: "400", color: "#333333" }}>
                      Rs. {variant.normalPrice}
                    </span>
                  </p>
                  {/* <p
                    className="mb-0"
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#000000",
                    }}
                  >
                    <span
                     
                    >
                      Offer Price:
                    </span>{" "}
                    <span style={{ fontWeight: "400", color: "#333333" }}>
                      Rs. {variant.offerPrice}
                    </span>
                  </p> */}
                </div>
              ))}
            </div>

            <Row className="mb-3">
              <Col md={12}>
                <h3 className="features-heading">Features</h3>

                <Row className="mb-4">
                  {selectedProductType === "Dress" && (
                    <>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="single-product-form-label">
                            Material
                          </Form.Label>
                          <Form.Control
                            className="single-product-form"
                            type="text"
                            placeholder="Enter Material"
                            value={material}
                            onChange={(e) => setMaterial(e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="single-product-form-label">
                            Sleeves Type
                          </Form.Label>
                          <Form.Control
                            className="single-product-form"
                            type="text"
                            placeholder="Enter Sleeves Type"
                            value={sleevesType}
                            onChange={(e) => setSleevesType(e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                    </>
                  )}

                  {selectedProductType === "Chappal" && (
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="single-product-form-label">
                          Sole Material
                        </Form.Label>
                        <Form.Control
                          className="single-product-form"
                          type="text"
                          placeholder="Enter Sole Material"
                          value={soleMaterial}
                          onChange={(e) => setSoleMaterial(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  )}
                </Row>

                {/* Fields Shown for Both */}
                <Row className="mb-4">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="single-product-form-label">
                        Fit
                      </Form.Label>
                      <Form.Control
                        className="single-product-form"
                        type="text"
                        placeholder="Enter Fit"
                        value={fit}
                        onChange={(e) => setFit(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="single-product-form-label">
                        Length
                      </Form.Label>
                      <Form.Control
                        className="single-product-form"
                        type="text"
                        placeholder="Enter Length"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="single-product-form-label">
                        Occasion
                      </Form.Label>
                      <Form.Control
                        className="single-product-form"
                        type="text"
                        placeholder="Enter Occasion"
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="single-product-form-label">
                        Net Weight
                      </Form.Label>
                      <Form.Control
                        className="single-product-form"
                        type="text"
                        placeholder="Enter Net Weight"
                        value={netWeight}
                        onChange={(e) => setNetWeight(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>

            {/* <Row className="mb-3">
              <Col md={12}>
                <Row className="mb-3">
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label className="single-product-form-label">
                        Offer
                      </Form.Label>
                      <Form.Control
                        className="single-product-form"
                        type="text"
                        placeholder="Rs."
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label className="single-product-form-label">
                        Coupon
                      </Form.Label>
                      <Form.Control
                        className="single-product-form"
                        type="text"
                        placeholder="10%"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row> */}
            <Row className="mb-4">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Is Returnable
                  </Form.Label>
                  <Form.Select
                    className="single-product-form"
                    value={isReturnable}
                    onChange={(e) => setIsReturnable(e.target.value)}
                  >
                    <option value="">Select Option</option>
                    <option value="true">YES</option>
                    <option value="false">NO</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Return Within (Days)
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="number"
                    placeholder="Enter number of days"
                    value={returnWithinDays}
                    onChange={(e) => setReturnWithinDays(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Is COD Available
                  </Form.Label>
                  <Form.Select
                    className="single-product-form"
                    value={CODAvailable}
                    onChange={(e) => setCODAvailable(e.target.value)}
                  >
                    <option value="">Select Option</option>
                    <option value="true">YES</option>
                    <option value="false">NO</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
          <button
            className="w-25 category-model-cancel"
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

export default Addproduct;
