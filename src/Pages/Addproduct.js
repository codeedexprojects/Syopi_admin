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
  const [productName, setProductName] = useState("");
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");

  const [description, setDescription] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedProductType, setSelectedProductType] = useState("");
  const [wholesalePrice, setWholesalePrice] = useState("");
  const [price, setPrice] = useState("");
  const [soleMaterial, setSoleMaterial] = useState("");
  const [CODAvailable, setCODAvailable] = useState("");
  const [fit, setFit] = useState("");
  const [sleevesType, setSleevesType] = useState("");
  const [length, setLength] = useState("");
  const [cost, setCost] = useState("");
  const [netWeight, setNetWeight] = useState("");
  const [isReturnable, setIsReturnable] = useState("");
  const [returnWithinDays, setReturnWithinDays] = useState("");
  const [occasion, setOccasion] = useState("");
  const [material, setMaterial] = useState("");
  const adminID = localStorage.getItem("adminId");
  const [color, setColor] = useState("#000000");
  const [colorName, setColorName] = useState("Black");
  const [sizeStocks, setSizeStocks] = useState({});
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [variantImages, setVariantImages] = useState([null, null, null, null]);
  const [loading, setLoading] = useState(false);
  const [lengthUnit, setLengthUnit] = useState("cm");

  // All variants for the product
  const [variants, setVariants] = useState([]);

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

  const fetchSubCategories = async (categoryId) => {
    try {
      const response = await getsubcategoryByID(categoryId);
      console.log("sub", response);

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

  const handleCategoryChange = async (e) => {
    const selectedCategoryId = e.target.value;
    setSelectedCategory(selectedCategoryId);

    // Find the full category object based on the selected ID
    const selectedCategoryObj = categories.find(
      (cat) => cat._id === selectedCategoryId
    );

    // Set the name from the found category object
    setSelectedCategoryName(selectedCategoryObj?.name || "");

    if (selectedCategoryId) {
      await fetchSubCategories(selectedCategoryId);
    } else {
      setSubCategories([]);
    }
  };

  const handleSubCategoryChange = (e) => {
    setSelectedSubCategory(e.target.value);
  };

  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
  };

// Image compression utility
const compressImage = (file, maxWidth = 800, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxWidth) {
          width = (width * maxWidth) / height;
          height = maxWidth;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Create a new File object with compressed data
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Compression failed'));
          }
        },
        'image/jpeg',
        quality
      );
    };
    
    img.onerror = () => reject(new Error('Image loading failed'));
    img.src = URL.createObjectURL(file);
  });
};

// Enhanced validation function
const validateImageFile = (file) => {
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!file) {
    return { isValid: false, error: "No file selected" };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: "Only JPEG, PNG, GIF, and WebP images are allowed" };
  }
  
  if (file.size > maxSize) {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return { isValid: false, error: `File size (${fileSizeMB}MB) exceeds 5MB limit` };
  }
  
  return { isValid: true, error: null };
};

// Updated handleVariantImageChange function with compression
const handleVariantImageChange = async (index, event) => {
  if (event.target.files && event.target.files[0]) {
    const file = event.target.files[0];
    const validation = validateImageFile(file);
    
    if (!validation.isValid) {
      toast.error(validation.error);
      event.target.value = '';
      return;
    }
    
    try {
      // Show compression progress
      
      // Compress the image
      const compressedFile = await compressImage(file, 800, 0.7);
      
      // Log compression results
      const originalSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const compressedSizeMB = (compressedFile.size / (1024 * 1024)).toFixed(2);
      console.log(`Image compressed: ${originalSizeMB}MB → ${compressedSizeMB}MB`);
      
      const newImages = [...variantImages];
      newImages[index] = compressedFile;
      setVariantImages(newImages);
      
    } catch (error) {
      console.error('Compression error:', error);
      toast.error('Failed to compress image. Please try a different image.');
      event.target.value = '';
    }
  }
};

// Enhanced form submit handler with better error handling
const handleFormSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  if (!productName || !selectedCategory || !description) {
    toast.error("All fields are required");
    setLoading(false);
    return;
  }

  if (variants.length === 0) {
    toast.error("At least one variant is required");
    setLoading(false);
    return;
  }

  // Calculate total payload size before sending
  let totalSize = 0;
  const maxTotalSize = 45 * 1024 * 1024; // 45MB limit to be safe

  try {
    const formData = new FormData();
    
    // Add text fields
    formData.append("name", productName.trim());
    formData.append("cost", cost.trim());
    formData.append("description", description.trim());
    formData.append("category", selectedCategory);
    formData.append("subcategory", selectedSubCategory || "");
    formData.append("brand", selectedBrand || "");
    formData.append("isReturnable", isReturnable || "false");
    formData.append("CODAvailable", CODAvailable || "false");
    formData.append("returnWithinDays", returnWithinDays || "");
    formData.append("productType", selectedProductType || "");
    formData.append("owner", adminID || "");
    formData.append("fileType", "product");
    formData.append("userType", "admin");

    // Compress and add main product images
    if (variants[0]?.images) {
      for (let i = 0; i < variants[0].images.length; i++) {
        const image = variants[0].images[i];
        if (image) {
          let processedImage = image;
          
          // Compress if image is large
          if (image.size > 1024 * 1024) { // If larger than 1MB
            toast.info(`Compressing main image ${i + 1}...`);
            processedImage = await compressImage(image, 800, 0.7);
          }
          
          formData.append("images", processedImage);
          totalSize += processedImage.size;
        }
      }
    }

    // Prepare features
    const features = {
      material: selectedProductType === "Dress" ? material || "" : undefined,
      soleMaterial: selectedProductType === "Chappal" ? soleMaterial || "" : undefined,
      netWeight: netWeight || "",
      fit: fit || "",
      sleevesType: selectedProductType === "Dress" ? sleevesType || "" : undefined,
      length: length ? `${length} ${lengthUnit}` : "",
      occasion: occasion || "",
    };

    const cleanedFeatures = Object.fromEntries(
      Object.entries(features).filter(([_, value]) => value !== undefined)
    );

    formData.append("features", JSON.stringify(cleanedFeatures));

    const formattedVariants = variants.map((variant, index) => {
      const { images, ...variantData } = variant;
      return {
        ...variantData,
        imageIndexes: Array(variant.images.length)
          .fill()
          .map((_, i) => `${index}_${i}`),
      };
    });

    formData.append("variants", JSON.stringify(formattedVariants));

    // Compress and add variant images
    for (let variantIndex = 0; variantIndex < variants.length; variantIndex++) {
      const variant = variants[variantIndex];
      for (let imageIndex = 0; imageIndex < variant.images.length; imageIndex++) {
        const image = variant.images[imageIndex];
        if (image) {
          let processedImage = image;
          
          // Compress if image is large
          if (image.size > 1024 * 1024) { // If larger than 1MB
            toast.info(`Compressing variant image ${variantIndex + 1}-${imageIndex + 1}...`);
            processedImage = await compressImage(image, 800, 0.7);
          }
          
          formData.append(`variantImages[${variantIndex}]`, processedImage);
          totalSize += processedImage.size;
        }
      }
    }

    // Check total size
    if (totalSize > maxTotalSize) {
      const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
      toast.error(`Total upload size (${totalSizeMB}MB) exceeds limit. Please reduce image quality or quantity.`);
      setLoading(false);
      return;
    }

    console.log("FormData being sent:");
    console.log(`Total payload size: ${(totalSize / (1024 * 1024)).toFixed(2)}MB`);
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File(${value.name}, ${(value.size / 1024).toFixed(1)}KB)`);
      } else {
        console.log(`${key}:`, value);
      }
    }

    // Send API request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    const response = await createProductApi(formData, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    console.log(response);

    if (response.success) {
      toast.success("Product created successfully");
      // Reset all form fields
      setProductName("");
      setDescription("");
      setSelectedCategory("");
      setSelectedCategoryName("");
      setSelectedSubCategory("");
      setCost("");
      setSelectedBrand("");
      setIsReturnable("");
      setCODAvailable("");
      setReturnWithinDays("");
      setSelectedProductType("");
      setNetWeight("");
      setFit("");
      setMaterial("");
      setSoleMaterial("");
      setSleevesType("");
      setLength("");
      setLengthUnit("cm");
      setOccasion("");
      setColor("#000000");
      setColorName("Black");
      setWholesalePrice("");
      setPrice("");
      setSizeStocks({});
      setSelectedSizes([]);
      setVariantImages([null, null, null, null]);
      setVariants([]);
    } else {
      toast.error(response.error || "Failed to create product");
    }
  } catch (err) {
    console.error('Upload error:', err);
    if (err.name === 'AbortError') {
      toast.error("Upload timeout. Please try again with smaller images.");
    } else if (err.message.includes('413')) {
      toast.error("Upload too large. Please compress your images further.");
    } else {
      toast.error(err.message || "An unexpected error occurred");
    }
  } finally {
    setLoading(false);
  }
};

  const handleSelectVariantImage = (index) => {
    if (variantImages[index] && variantImages[0] !== variantImages[index]) {
      const updatedImages = [...variantImages];
      const temp = updatedImages[0];
      updatedImages[0] = updatedImages[index];
      updatedImages[index] = temp;
      setVariantImages(updatedImages);
    }
  };

 const handleAddVariant = () => {
  if (!color || !colorName || Object.keys(sizeStocks).length === 0) {
    toast.error("Please fill in all required fields for the variant");
    return;
  }

  if (!variantImages[0]) {
    toast.error("At least one image is required for each variant");
    return;
  }

  // Validate all uploaded images
  const filteredImages = variantImages.filter((img) => img !== null);
  for (let i = 0; i < filteredImages.length; i++) {
    const validation = validateImageFile(filteredImages[i]);
    if (!validation.isValid) {
      toast.error(`Image ${i + 1}: ${validation.error}`);
      return;
    }
  }

  if (!wholesalePrice || !price) {
    toast.error("Please enter both wholesale and normal prices");
    return;
  }

  if (isNaN(Number(wholesalePrice)) || isNaN(Number(price))) {
    toast.error("Prices must be valid numbers");
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

  const newVariant = {
    color,
    colorName,
    wholesalePrice: Number(wholesalePrice),
    price: Number(price),
    stock: totalStock,
    sizes: formattedSizes,
    images: filteredImages,
  };

  setVariants((prevVariants) => [...prevVariants, newVariant]);

  setColor("#000000");
  setColorName("Black");
  setWholesalePrice("");
  setPrice("");
  setSizeStocks({});
  setSelectedSizes([]);
  setVariantImages([null, null, null, null]);

  toast.success("Variant added successfully");
};
  const kidSizes = ["New Born", "0-1", "1-2", "2-3", "3-4", "4-5", "5-6"];
  const adultSizes = ["S", "M", "L", "XL", "XXL", "XXXL"];
  const currentSizes =
    selectedCategoryName?.toLowerCase() === "kids" ? kidSizes : adultSizes;

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
    if (stock === "" || (!isNaN(Number(stock)) && Number(stock) >= 0)) {
      setSizeStocks((prev) => ({ ...prev, [size]: stock }));
    }
  };

  return (
    <div className="single-product">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="single-product-title">Add Product</h2>
        </Col>
      </Row>
      <Form onSubmit={handleFormSubmit}>
        <Row>
         <Col md={3}>
  <div className="position-relative">
    <h4 className="mb-3">Current Variant Images</h4>
    <p className="text-muted small mb-2">Max file size: 5MB per image</p>
    <div className="image-square large">
      {variantImages[0] ? (
        <img
          src={URL.createObjectURL(variantImages[0])}
          alt="Selected Product"
          className="img-fluid added-image"
        />
      ) : (
        <div className="add-image-icon">+</div>
      )}
      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        className="image-input"
        onChange={(event) => handleVariantImageChange(0, event)}
      />
    </div>
  </div>
  <Row className="mt-3">
    {[1, 2, 3].map((index) => (
      <Col key={index} xs={4} className="position-relative">
        <div
          className="image-square small"
          onClick={() => handleSelectVariantImage(index)}
        >
          {variantImages[index] ? (
            <img
              src={URL.createObjectURL(variantImages[index])}
              alt={`Product ${index + 1}`}
              className="img-fluid added-image"
            />
          ) : (
            <div className="add-image-icon">+</div>
          )}
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            className="image-input"
            onChange={(event) =>
              handleVariantImageChange(index, event)
            }
          />
        </div>
      </Col>
    ))}
  </Row>
</Col>
          <Col md={9} className="single-product-right-column">
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
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
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
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
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
                    <Form.Select
                      className="single-product-form custom-dropdown"
                      aria-label="Select Product Type"
                      value={selectedProductType}
                      onChange={(e) => setSelectedProductType(e.target.value)}
                    >
                      <option value="">Select Product Type</option>
                      <option value="Dress">Dress</option>
                      <option value="Chappal">Chappal</option>
                    </Form.Select>
                    <FaChevronDown className="dropdown-icon" />
                  </div>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Cost
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Enter Cost"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Variant details */}
            <h4 className="mt-4 mb-3">Variant Details</h4>
            <Row className="mb-3">
              <Col md={12}>
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
                    />

                    <Form.Control
                      className="single-product-form mx-2"
                      type="color"
                      value={color}
                      style={{ padding: "5px", height: "40px", width: "6%" }}
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
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Wholesale Price
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="number"
                    placeholder="Rs."
                    value={wholesalePrice}
                    onChange={(e) => setWholesalePrice(e.target.value)}
                    min="0"
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
                    type="number"
                    placeholder="Rs."
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    {selectedCategoryName?.toLowerCase() === "kids"
                      ? "Age and Stock"
                      : "Size and Stock"}
                  </Form.Label>
                  <div className="size-selection">
                    {currentSizes.map((size) => (
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
                            min="0"
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

            {/* Display added variants */}
            <div className="mt-4">
              <h4 className="mb-3">Added Variants ({variants.length})</h4>
              {variants.length === 0 && (
                <p className="text-muted">
                  No variants added yet. Add at least one variant.
                </p>
              )}
              {variants.map((variant, index) => (
                <div
                  key={index}
                  className="variant-card p-4 border rounded shadow-sm mb-4"
                  style={{
                    backgroundColor: "#f9f9f9",
                    borderLeft: `5px solid ${variant.color}`,
                    borderRadius: "10px",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
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
                          {variant.colorName}{" "}
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
                            .map(
                              ({ size, stock }) => `${size} (Stock: ${stock})`
                            )
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
                    <div>
                      <p
                        className="mb-2"
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#000000",
                        }}
                      >
                        <span>Images:</span>{" "}
                        <span style={{ fontWeight: "400", color: "#333333" }}>
                          {variant.images.length} uploaded
                        </span>
                      </p>
                      <div className="d-flex">
                        {variant.images.slice(0, 3).map((img, imgIndex) => (
                          <div
                            key={imgIndex}
                            style={{
                              width: "50px",
                              height: "50px",
                              marginRight: "10px",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              overflow: "hidden",
                            }}
                          >
                            <img
                              src={URL.createObjectURL(img)}
                              alt={`Variant ${index}Image ${imgIndex}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        ))}
                        {variant.images.length > 3 && (
                          <div
                            style={{
                              width: "50px",
                              height: "50px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#f0f0f0",
                              borderRadius: "4px",
                            }}
                          >
                            +{variant.images.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Features section */}
            <Row className="mb-3 mt-4">
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
  <div className="position-relative">
    <Form.Control
      className="single-product-form"
      type="text"
      placeholder="Enter Length"
      value={length}
      onChange={(e) => setLength(e.target.value)}
      style={{ paddingRight: "80px" }} // Add padding to make room for the dropdown
    />
    <Form.Select 
      className="position-absolute"
      style={{ 
        top: 0, 
        right: 0, 
        width: "80px", 
        height: "100%", 
        borderTopLeftRadius: 0, 
        borderBottomLeftRadius: 0,
        borderLeft: "1px solid #ced4da",
        background:"e9e9e9"
      }}
      value={lengthUnit}
      onChange={(e) => setLengthUnit(e.target.value)}
    >
      <option value="cm">cm</option>
      <option value="m">m</option>
    </Form.Select>
  </div>
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
                    min="0"
                    disabled={isReturnable !== "true"}
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

            <button type="submit" className="w-25 category-model-add" disabled={loading}>
  {loading ? (
    <>
      <span
        className="spinner-border spinner-border-sm me-2"
        role="status"
        aria-hidden="true"
      ></span>
      Loading...
    </>
  ) : (
    "Add"
  )}
</button>

          </Col>
        </Row>
      </Form>
      <ToastContainer />
    </div>
  );
}

export default Addproduct;
