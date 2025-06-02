import React, { useEffect, useState } from "react";
import { Row, Col, Form, Modal, Button } from "react-bootstrap";
import "./singleproduct.css";
import { FaChevronDown } from "react-icons/fa";
import {
  deleteProductapi,
  deleteProductImageApi,
  getAllBrandsApi,
  getCategoriesApi,
  getproductByID,
  getsubcategoryByID,
  updateproductapi,
} from "../services/allApi";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { BASE_URL } from "../services/baseUrl";

function SingleProduct() {
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
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [soleMaterial, setSoleMaterial] = useState("");
  const [fit, setFit] = useState("");
  const [brands, setBrands] = useState([]);
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
  const [selectedBrand, setSelectedBrand] = useState("");
  const [isReturnable, setIsReturnable] = useState(false);
  const [returnWithinDays, setReturnWithinDays] = useState(7);
  const [codAvailable, setCodAvailable] = useState(false);
  const [variantImages, setVariantImages] = useState({});
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);

  useEffect(() => {
    const fetchproductData = async () => {
      try {
        const response = await getproductByID(id);
        console.log(response);
  
        if (response && response.data) {
          const product = response.data;
          setProducts(product);
          setImages(product.images || [null, null, null, null]);
          setProductName(product.name || "");
          setDescription(product.description || "");
          setBrand(product.brand || "");
          setStock(product.totalStock || "");
          setSelectedProductType(product.productType || "");
          setVariants(product.variants || []);
          setMaterial(product.features?.material || "");
          setSleevesType(product.features?.sleevesType || "");
          setSoleMaterial(product.features?.soleMaterial || "");
          setFit(product.features?.fit || "");
          setLength(product.features?.length || "");
          setOccasion(product.features?.occasion || "");
          setNetWeight(product.features?.netWeight || "");
          setProductId(product._id);
          setSelectedCategory(product.category._id);
          setSelectedSubCategory(product.subcategory._id);
          // Set new fields
          setIsReturnable(product.isReturnable || false);
          setReturnWithinDays(product.returnWithinDays || 7);
          setCodAvailable(product.CODAvailable || false);
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
  const fetchsubCategories = async (categoryId) => {
    try {
      const response = await getsubcategoryByID(categoryId);
      console.log("subcategories", response);

      if (response.success && Array.isArray(response.data)) {
        setSubCategories(response.data);
      } else {
        console.error(
          "Failed to fetch categories:",
          response.error || "Unknown error"
        );
        setSubCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error.message);
      setSubCategories([]);
    }
  };

  useEffect(() => {
    fetchsubCategories();
  }, []);
  const fetchBrands = async () => {
    try {
      const response = await getAllBrandsApi();
      console.log("brands", response);

      if (response.status === 200) {
        setBrands(response.data);
      } else {
        console.error(
          "Failed to fetch brands:",
          response.error || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error fetching brands:", error.message);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);
  const handleCategoryChange = async (e) => {
    const selectedCategoryId = e.target.value;

    setSelectedCategory(selectedCategoryId);
    if (selectedCategoryId) {
      await fetchsubCategories(selectedCategoryId);
    } else {
      setSubCategories([]);
    }
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

const handleImageChange = (variantIndex, imageIndex, event) => {
  if (event.target.files && event.target.files[0]) {
    const file = event.target.files[0];
    
    // Update the variant images state
    setVariantImages(prev => {
      const updatedImages = { ...prev };
      if (!updatedImages[variantIndex]) {
        updatedImages[variantIndex] = [null, null, null, null];
      }
      updatedImages[variantIndex][imageIndex] = file;
      return updatedImages;
    });

    // Update preview images
    setPreviewImages(prev => {
      const newPreviewImages = [...prev];
      if (!newPreviewImages[variantIndex]) {
        newPreviewImages[variantIndex] = [];
      }
      newPreviewImages[variantIndex][imageIndex] = URL.createObjectURL(file);
      return newPreviewImages;
    });
  }
};

const handleRemoveImage = (variantIndex, imageIndex) => {
  setVariantImages(prev => {
    const updatedImages = { ...prev };
    if (updatedImages[variantIndex]) {
      updatedImages[variantIndex][imageIndex] = null;
    }
    return updatedImages;
  });

  setPreviewImages(prev => {
    const newPreviewImages = [...prev];
    if (newPreviewImages[variantIndex]) {
      newPreviewImages[variantIndex][imageIndex] = null;
    }
    return newPreviewImages;
  });
};

  const handleDeleteModalOpen = () => setShowDeleteModal(true);
  const handleDeleteModalClose = () => setShowDeleteModal(false);
  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
  };
  const handleDeleteConfirm = async () => {
    try {
      await deleteProductapi(id);
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
    const imageName = products?.images?.[imageIndex];
    console.log("Selected image name:", imageName);

    if (imageName) {
      setImageToDelete(imageName);
      setIsModalOpen(true);
    } else {
      console.error("Image not found at the specified index.");
    }
  };

  const confirmDeleteImage = async () => {
    if (!imageToDelete) {
      console.error("Image not found in product.");
      setIsModalOpen(false);
      return;
    }
  
    const productId = products?._id;
    const { variantIndex, imageName } = imageToDelete;
  
    try {
      const response = await deleteProductImageApi(productId, {
        variantIndex: variantIndex,
        imageName: imageName
      });
  
      if (response.success) {
        toast.success("Image deleted successfully!");
  
        // Update the variants state to remove the deleted image
        setVariants(prevVariants => {
          const updatedVariants = [...prevVariants];
          if (updatedVariants[variantIndex]?.images) {
            updatedVariants[variantIndex].images = updatedVariants[variantIndex].images.filter(
              image => image !== imageName
            );
          }
          return updatedVariants;
        });
      } else {
        toast.error(response.error || "Failed to delete the image. Please try again.");
      }
    } catch (error) {
      console.error("Error during image deletion:", error);
      toast.error("An error occurred while deleting the image.");
    } finally {
      setIsModalOpen(false);
      setImageToDelete(null);
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
  
    const formattedSizes = Object.entries(sizeStocks).map(([size, stock]) => ({
      size,
      stock: Number(stock),
    }));
  
    const totalStock = formattedSizes.reduce(
      (sum, { stock }) => sum + stock,
      0
    );
  
    // Add images to the variant
    const variantIndex = editingIndex !== null ? editingIndex : variants.length;
    const variantImagesArray = variantImages[variantIndex] || [];
  
    const newVariant = {
      color,
      wholesalePrice: Number(wholesalePrice) || 0,
      price: Number(price) || 0,
      stock: totalStock,
      sizes: formattedSizes,
      images: variantImagesArray.filter(img => img !== null)
    };
  
    if (editingIndex !== null) {
      setVariants((prevVariants) =>
        prevVariants.map((variant, index) =>
          index === editingIndex ? newVariant : variant
        )
      );
      setEditingIndex(null);
    } else {
      setVariants((prevVariants) => [...prevVariants, newVariant]);
    }
  
    clearFormFields();
  };
  

// Updated handleEditVariant function to handle variant images
const handleEditVariant = (index) => {
  const variant = variants[index];
  setColor(variant.color);
  setwholesalePrice(variant.wholesalePrice);
  setPrice(variant.price);

  const sizeStockObj = {};
  variant.sizes.forEach(({ size, stock }) => {
    sizeStockObj[size] = stock;
  });
  setSizeStocks(sizeStockObj);
  setSelectedSizes(variant.sizes.map(({ size }) => size));
  
  // Set the selected variant index for image handling
  setSelectedVariantIndex(index);
  
  // If the variant has images, they will be displayed in the variant card
  // No need to load them into the image fields at the top

  setEditingIndex(index);
};

  const clearFormFields = () => {
    setColor("");
    setColor("#ffffff");
    setwholesalePrice("");
    setPrice("");
    setSizeStocks({});
    setSelectedSizes([]);
  };
  
  const productnavigation=()=>{
    navigate('/products')
    }
  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    if (!productName || !selectedCategory || !description) {
      toast.error("All fields are required");
      return;
    }
  
    // Format variants correctly as per backend expectations
    const formattedVariants = variants.map((variant, index) => {
      const variantData = {
        color: variant.color,
        price: variant.price, 
        wholesalePrice: variant.wholesalePrice,
        stock: variant.stock,
        sizes: variant.sizes,
        images: variant.images || [] // Include existing images
      };
      return variantData;
    });
  
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
    formData.append("brand", brand.trim() || "");
    formData.append("stock", stock || "");
    formData.append("type", occasion || "");
    formData.append("productType", selectedProductType || "");
    formData.append("material", material || "");
    formData.append("owner", adminID || "");
    formData.append("fileType", "product");
    formData.append("userType", "admin");
    formData.append("variants", JSON.stringify(formattedVariants));
    formData.append("features", JSON.stringify(cleanedFeatures));
    
    // Add new fields
    formData.append("isReturnable", isReturnable);
    formData.append("returnWithinDays", returnWithinDays);
    formData.append("CODAvailable", codAvailable);
  
    // Add new variant images to FormData
    Object.entries(variantImages).forEach(([variantIndex, images]) => {
      images.forEach((image, imageIndex) => {
        if (image && image instanceof File) {
          formData.append(`variantImages`, image);
          formData.append(`variantImageMeta`, JSON.stringify({
            variantIndex,
            imageIndex
          }));
        }
      });
    });
  
    console.log("FormData being sent:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  
    try {
      const response = await updateproductapi(productId, formData);
  
      if (response.success) {
        toast.success("Product updated successfully");
        // Optionally redirect to products page after successful update
        // navigate("/products");
      } else {
        toast.error(response.error || "Failed to update product");
      }
    } catch (err) {
      toast.error(err.message || "An unexpected error occurred");
    }
  };

  return (
    <div className=" single-product">
      <Row className="mb-4 align-items-center">
      <h5
  onClick={productnavigation}
  style={{
    cursor: "pointer",
    color: "rgb(56, 186, 244)",
    textDecoration: "underline",
    marginBottom: "1rem",
    display: "inline-block",
  }}
>
  ← Back
</h5>


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
          <div className="position-relative single-product-wrapper">
            {products?.images?.[0] || images[0] ? (
              <img
                src={
                  products.images?.[0]
                    ? `${BASE_URL}/uploads/${products.images[0]}`
                    : previewImages[0] || "placeholder-image-path"
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
                    <Form.Select
                      className="single-product-form custom-dropdown"
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      aria-label="Select category"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </Form.Select>
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
                    <Form.Select
                      className="single-product-form custom-dropdown"
                      value={selectedSubCategory}
                      onChange={handleSubCategoryChange}
                      aria-label="Select subcategory"
                      disabled={!selectedCategory}
                    >
                      <option value="">Select sub category</option>
                      {subcategories.map((subcategory) => (
                        <option key={subcategory._id} value={subcategory._id}>
                          {subcategory.name}
                        </option>
                      ))}
                    </Form.Select>
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
                    <Form.Select
                      className="single-product-form custom-dropdown"
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
                    </Form.Select>
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
                    placeholder="Enter color name"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
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

      <div className="row mb-3">
        <div className="col-md-6">
          {/* Variant details */}
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
        </div>
        
        <div className="col-md-6">
          {/* Variant Images */}
          <p
            className="mb-2"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "16px",
              fontWeight: "600",
              color: "#000000",
            }}
          >
            Variant Images:
          </p>
          
          <div className="d-flex flex-wrap">
            {/* Show existing images for this variant */}
            {variant.images && variant.images.map((imageName, imgIndex) => (
              <div key={imgIndex} className="position-relative me-2 mb-2" style={{ width: '80px', height: '80px' }}>
                <img
                  src={`${BASE_URL}/uploads/${imageName}`}
                  alt={`Variant ${index} Image ${imgIndex}`}
                  className="img-fluid"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                />
                <i
                  className="fa-solid fa-trash position-absolute"
                  style={{ top: '5px', right: '5px', cursor: 'pointer', color: 'red' }}
                  onClick={() => openDeleteModal(index, imgIndex)}
                ></i>
              </div>
            ))}
            
            {/* Add new image button */}
            <div 
              className="d-flex justify-content-center align-items-center" 
              style={{ 
                width: '80px', 
                height: '80px', 
                border: '1px dashed #ccc', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              onClick={() => document.getElementById(`variant-image-input-${index}`).click()}
            >
              <span style={{ fontSize: '24px', color: '#666' }}>+</span>
              <input
                id={`variant-image-input-${index}`}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(event) => handleImageChange(index, variant.images ? variant.images.length : 0, event)}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Preview new images */}
      {variantImages[index] && variantImages[index].filter(img => img !== null).length > 0 && (
        <div className="mt-2">
          <p className="mb-2" style={{ fontSize: '14px', fontWeight: '600' }}>New Images (Not yet saved):</p>
          <div className="d-flex flex-wrap">
            {variantImages[index].map((img, imgIndex) => 
              img && (
                <div key={`new-${imgIndex}`} className="position-relative me-2 mb-2" style={{ width: '80px', height: '80px' }}>
                  <img
                    src={previewImages[index]?.[imgIndex]}
                    alt={`New Variant ${index} Image ${imgIndex}`}
                    className="img-fluid"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <i
                    className="fa-solid fa-trash position-absolute"
                    style={{ top: '5px', right: '5px', cursor: 'pointer', color: 'red' }}
                    onClick={() => handleRemoveImage(index, imgIndex)}
                  ></i>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
})}
            </div>
            <Row className="mb-3 mt-4">
  <Col md={12}>
    <h3 className="shipping-options-heading">Shipping & Return Options</h3>
  </Col>
</Row>

<Row className="mb-3">
  <Col md={4}>
    <Form.Group className="mb-3">
      <Form.Check 
        type="checkbox" 
        label="COD Available" 
        checked={codAvailable}
        onChange={(e) => setCodAvailable(e.target.checked)}
        className="single-product-checkbox"
      />
    </Form.Group>
  </Col>
  <Col md={4}>
    <Form.Group className="mb-3">
      <Form.Check 
        type="checkbox" 
        label="Returnable" 
        checked={isReturnable}
        onChange={(e) => setIsReturnable(e.target.checked)}
        className="single-product-checkbox"
      />
    </Form.Group>
  </Col>
  {isReturnable && (
    <Col md={4}>
      <Form.Group>
        <Form.Label className="single-product-form-label">Return Window (Days)</Form.Label>
        <Form.Control
          className="single-product-form"
          type="number"
          min="1"
          max="30"
          value={returnWithinDays}
          onChange={(e) => setReturnWithinDays(e.target.value)}
        />
      </Form.Group>
    </Col>
  )}
</Row>
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

export default SingleProduct;
