import React, { useEffect, useState } from "react";
import { Row, Col, Form, Modal, Button } from "react-bootstrap";
import "../singleproduct.css";
import { FaChevronDown } from "react-icons/fa";

import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { deletevendorProductapi, deletevendorProductImageApi, getVendorCategoriesApi, getvendorproductByID, getVendorSubCategoriesApi, updatevendorproductapi } from "../../services/allApi";
import { BASE_URL } from "../../services/baseUrl";

function VendorSingleProduct() {
  const { id } = useParams();
  const [images, setImages] = useState([null, null, null, null]);
  const [color, setColor] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [products, setProducts] = useState({});
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [imageToDelete, setImageToDelete] = useState(null);
  const [selectedProductType, setSelectedProductType] = useState("");
  const [wholesalePrice, setwholesalePrice] = useState("");
  const [price, setPrice] = useState("");
  // const [offerPrice, setOfferPrice] = useState("");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [soleMaterial, setSoleMaterial] = useState("");
  const [fit, setFit] = useState("");
  const [sleevesType, setSleevesType] = useState("");
  const [length, setLength] = useState("");
  const [netWeight, setNetWeight] = useState("");
  const [occasion, setOccasion] = useState("");
  const [material, setMaterial] = useState("");
  const [variants, setVariants] = useState([]);
  const [sizeStocks, setSizeStocks] = useState({});
  const [editingIndex, setEditingIndex] = useState(null); 
  const [productId, setProductId] = useState("");
  const adminID = localStorage.getItem("adminId");
const [previewImages, setPreviewImages] = useState([]); 


  useEffect(() => {
    const fetchproductData = async () => {
      try {
        const response = await getvendorproductByID(id);
        console.log(response);

        if (response && response.data) {
          const product = response.data;
          setProducts(product); // Set the full product object
          setImages(products.images || [null, null, null, null]); // Set images if available
          setProductName(product.name || "");
          setDescription(product.description || "");
          setBrand(product.brand || "");
          setStock(product.totalStock || "");
          setSelectedProductType(product.productType || ""); // Automatically set Product Type
          setVariants(product.variants || ""); // Automatically set Product Type
          setMaterial(product.features.material);
          setSleevesType(product.features.sleevesType || "");
          setSoleMaterial(product.features.soleMaterial || "");
          setFit(product.features.fit || "");
          setLength(product.features.length || "");
          setOccasion(product.features.occasion || "");
          setNetWeight(product.features.netWeight || "");
          setProductId(product._id);

          setSelectedCategory(product.category._id);
          setSelectedSubCategory(product.subcategory._id);
        } else {
          console.error("Invalid response format:", response);
        }
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };

    if (id) {
      fetchproductData();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await getVendorCategoriesApi();
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
  const fetchsubCategories = async () => {
    try {
      const response = await getVendorSubCategoriesApi();
      if (response.success && Array.isArray(response.data)) {
        setSubCategories(response.data);
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
    fetchsubCategories();
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };
  const handleSubCategoryChange = (e) => {
    setSelectedSubCategory(e.target.value);
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
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
  
      // Update the files array
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);
  
      // Update the preview URLs array
      const newPreviewImages = [...previewImages];
      newPreviewImages[index] = URL.createObjectURL(file);
      setPreviewImages(newPreviewImages);
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
      await deletevendorProductapi(id);
      toast.success("Product deleted successfully!", {
        onClose: () => navigate("/products"),
      });
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting product:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "Failed to delete product. Please try again.";
      toast.error(errorMessage);
    }
  };

  const openDeleteModal = (imageIndex) => {
    const imageName = products?.images?.[imageIndex]; // Access image name by index
    console.log("Selected image name:", imageName); // Debug log for the image name

    if (imageName) {
      setImageToDelete(imageName); // Set the selected image name
      setIsModalOpen(true); // Open the delete confirmation modal
    } else {
      console.error("Image not found at the specified index.");
    }
  };

  const confirmDeleteImage = async () => {
    if (!imageToDelete) {
      console.error("Image not found in product."); // Corrected message
      setIsModalOpen(false);
      return;
    }

    // Assuming `_id` is available in `products`
    const productId = products?._id;

    try {
      // Make the API call to delete the image
      const response = await deletevendorProductImageApi(productId, {
        imageName: imageToDelete,
      });

      if (response.success) {
        toast.success("Image deleted successfully!");

        // Update the product images in state after deletion
        setProducts((prevData) => ({
          ...prevData,
          images: prevData.images.filter((image) => image !== imageToDelete),
        }));
      } else {
        toast.error(
          response.error || "Failed to delete the image. Please try again."
        );
      }
    } catch (error) {
      console.error("Error during image deletion:", error);
      toast.error("An error occurred while deleting the image.");
    } finally {
      setIsModalOpen(false);
      setImageToDelete(null); // Clear the image name after deletion
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setImageToDelete(null);
  };

  const handleAddVariant = () => {
    if (!color || !Object.keys(sizeStocks).length) {
      alert("Please fill in all required fields.");
      return;
    }

    // Map sizeStocks object into an array of sizes
    const formattedSizes = Object.entries(sizeStocks).map(([size, stock]) => ({
      size,
      stock: Number(stock),
    }));

    // Calculate the total stock
    const totalStock = formattedSizes.reduce(
      (sum, { stock }) => sum + stock,
      0
    );

    const newVariant = {
      color,
      wholesalePrice,
      price,
      // offerPrice,
      stock: totalStock,
      sizes: formattedSizes,
    };

    if (editingIndex !== null) {
      // Update an existing variant
      setVariants((prevVariants) =>
        prevVariants.map((variant, index) =>
          index === editingIndex ? newVariant : variant
        )
      );
      setEditingIndex(null); // Reset the editing index
    } else {
      // Add a new variant
      setVariants((prevVariants) => [...prevVariants, newVariant]);
    }

    // Clear fields
    clearFormFields();
  };

  // Handles editing a variant
  const handleEditVariant = (index) => {
    const variant = variants[index];
    setColor(variant.color);
    setwholesalePrice(variant.wholesalePrice);
    setPrice(variant.price);
    // setOfferPrice(variant.offerPrice);

    // Populate sizeStocks and selectedSizes
    const sizeStockObj = {};
    variant.sizes.forEach(({ size, stock }) => {
      sizeStockObj[size] = stock;
    });
    setSizeStocks(sizeStockObj);
    setSelectedSizes(variant.sizes.map(({ size }) => size));

    setEditingIndex(index); // Set the index of the variant being edited
  };

  // Clears the form fields
  const clearFormFields = () => {
    setColor("");
    setColor("#ffffff");
    setwholesalePrice("");
    setPrice("");
    // setOfferPrice("");
    setSizeStocks({});
    setSelectedSizes([]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!productName || !selectedCategory || !description) {
      toast.error("All fields are required");
      return;
    }

    // Transform variants into the required format
    const formattedVariants = variants.map((variant) => ({
      color: variant.color,
      price: variant.normalPrice,
      wholesalePrice: variant.wholesalePrice,
      offerPrice: variant.offerPrice,
      sizes: variant.sizes.map(({ size, stock }) => ({
        size,
        stock,
      })),
    }));

    const variantPayload = JSON.stringify(formattedVariants);

    // Prepare the features object
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

    // Remove undefined keys from the features object
    const cleanedFeatures = Object.fromEntries(
      Object.entries(features).filter(([_, value]) => value !== undefined)
    );

    // Initialize FormData
    const formData = new FormData();
    formData.append("name", productName.trim());
    formData.append("description", description.trim());
    formData.append("category", selectedCategory);
    formData.append("subcategory", selectedSubCategory || "");
    formData.append("brand", brand.trim() || "");
    formData.append("wholesalePrice", wholesalePrice || "");
    formData.append("normalPrice", price || "");
    // formData.append("offerPrice", offerPrice || "");
    formData.append("stock", stock || "");
    formData.append("sizes", selectedSizes || "");
    // formData.append("coupon", coupon || "");
    formData.append("type", occasion || "");
    // formData.append("colors", selectedcolors || "");
    // formData.append("offer", offer || "");
    formData.append("productType", selectedProductType || "");
    formData.append("material", material || "");
    formData.append("owner", adminID || "");
    formData.append("fileType", "product");
    formData.append("userType", "admin");
    formData.append("variants", variantPayload); // Add the variants
    formData.append("features", JSON.stringify(cleanedFeatures)); // Add the cleaned features object

    // Append all images
    // Append all images to FormData
images.forEach((image) => {
  if (image) {
    formData.append("images", image); // Append each file
  }
});


    console.log("FormData being sent:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      // Send API request
      const response = await updatevendorproductapi(productId, formData);

      if (response.success) {
        toast.success("Product edited successfully");
      } else {
        toast.error(response.error || "Failed to create product");
      }
    } catch (err) {
      toast.error(err.message || "An unexpected error occurred");
    }
  };

  return (
    <div className=" single-product">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="single-product-title">Product</h2>
        </Col>
        <Col className="text-end">
          <button
            className="me-2 remove-product-button"
            onClick={handleDeleteModalOpen}
          >
            Remove Product
          </button>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          {/* Main Vendor Image or Placeholder */}
          <div className="position-relative single-product-wrapper">
            {products?.images?.[0] || images[0] ? (
              <img
                src={
                  products.images?.[0]
                    ? `${BASE_URL}/uploads/${products.images[0]}`
                    : previewImages[0] || 'placeholder-image-path'
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
            {(products?.images?.[0] || images[0]) && (
              <i
                className="fa-solid fa-trash main-image-delete-icon"
                onClick={
                  products?.images?.[0]
                    ? () => openDeleteModal(0)
                    : () => handleRemoveImage(0)
                }
              ></i>
            )}
          </div>

          {/* Additional Images (Up to 4) */}
          <Row className="mt-3">
            {[...Array(4)].map((_, index) => (
              <Col key={index} xs={3} className="position-relative">
                <div className="image-square">
                  {products?.images?.[index + 1] || images[index + 1] ? (
                    <img
                      src={
                        products?.images?.[index + 1]
                          ? `${BASE_URL}/uploads/${products.images[index + 1]}`
                          : previewImages[index + 1]
                      }
                      alt={`AdditionalImage ${index + 1}`}
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
                  {(products?.images?.[index + 1] || images[index + 1]) && (
                    <i
                      className="fa-solid fa-trash additional-image-delete-icon"
                      onClick={
                        products?.images?.[index + 1]
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
              <Col md={6}>
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
              <Col md={6}>
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
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Enter brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
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
                  {/* Color Name Input */}
                  <Form.Control
                    className="single-product-form w-auto"
                    type="text"
                    placeholder="Enter color name"
                    value={color}
                    onChange={(e) => setColor(e.target.value)} // Update state on manual input
                  />

                  {/* Color Picker Input */}
                  <Form.Control
                    className="single-product-form mx-2"
                    type="color"
                    value={color} // The color picker reflects the selected color's hex value
                    style={{ padding: "5px" }}
                    onChange={(e) => {
                      const selectedColor = e.target.value;
                      setColor(selectedColor); // Update state with the hex value
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
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Offer Price
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Rs."
                    // value={offerPrice}
                    // onChange={(e) => setOfferPrice(e.target.value)}
                  />
                </Form.Group>
              </Col>
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
              {variants.map((variant, index) => {
                // Calculate total stock across all sizes
                const totalStock = variant.sizes.reduce(
                  (sum, { stock }) => sum + stock,
                  0
                );

                return (
                  <div
                    key={index}
                    className="variant-card p-4 border rounded shadow-sm mb-4 position-relative"
                    style={{
                      backgroundColor: "#f9f9f9",
                      borderLeft: "5px solid #000000",
                      borderRadius: "10px",
                    }}
                  >
                    {/* Edit Icon */}
                    <span
                      className="position-absolute"
                      style={{
                        top: "10px",
                        right: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleEditVariant(index)}
                    >
                      <i
                        className="fas fa-edit"
                        style={{
                          fontSize: "20px",
                          color: "#555555",
                        }}
                      ></i>
                    </span>

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
                        {totalStock}
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
                        Rs. {variant.price}
                      </span>
                    </p>
                    <p
                      className="mb-0"
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#000000",
                      }}
                    >
                      <span>Offer Price:</span>{" "}
                      <span style={{ fontWeight: "400", color: "#333333" }}>
                        Rs. {variant.offerPrice}
                      </span>
                    </p>
                  </div>
                );
              })}
            </div>

            <Row className="mb-3">
              <Col md={12}>
                {/* Features Heading */}
                <h3 className="features-heading">Features</h3>

                {/* Conditional Form Fields */}
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
                  {/* <Col md={4}>
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
                  </Col> */}
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
          </Form>
          <button
            className="w-25 category-model-cancel"
            onClick={handleFormSubmit}
          >
            Edit
          </button>{" "}
        </Col>
      </Row>

      <Modal show={showDeleteModal} onHide={handleDeleteModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title className="category-modal-title">
            Confirm Deletion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-with-scroll">
          <p className="delete-modal-text">
            Are you sure you want to delete this Product? This action cannot be
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
      <ToastContainer></ToastContainer>
    </div>
  );
}

export default VendorSingleProduct;
