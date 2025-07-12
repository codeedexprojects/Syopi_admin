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
  deleteProductVariantApi,
  updateproductapi,
} from "../services/allApi";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { BASE_URL } from "../services/baseUrl";
import ColorNamer from "color-namer";

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
  const [cost, setCost] = useState();
  const [brand, setBrand] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const [selectedBrand, setSelectedBrand] = useState("");
  const [isReturnable, setIsReturnable] = useState(false);
  const [returnWithinDays, setReturnWithinDays] = useState(7);
  const [codAvailable, setCodAvailable] = useState(false);
  const [variantPreviewImages, setVariantPreviewImages] = useState({});
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);
  const [isKidsCategory, setIsKidsCategory] = useState(false);
  const [colorName, setColorName] = useState("");
  const [newVariantImages, setNewVariantImages] = useState({});
const [deleteImageModal, setDeleteImageModal] = useState({
    show: false,
    imageName: null
  });

  const navigate = useNavigate();
  const adultSizes = ["S", "M", "L", "XL", "XXL", "XXXL"];
  const kidSizes = ["New Born", "0-1", "1-2", "2-3", "3-4", "4-5", "5-6"];

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
          setSelectedBrand(product.brand?._id || "");
          setCost(product.cost || "");
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
          if (product.category.name.toLowerCase().includes("kids")) {
            setIsKidsCategory(true);
          }
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

  const handleDeleteVariant = async (variantId) => {
  if (!window.confirm("Are you sure you want to delete this variant? This action cannot be undone.")) {
    return;
  }

  try {
    const response = await deleteProductVariantApi(productId, variantId, {});
    
    if (response.success) {
      toast.success("Variant deleted successfully!");
      // Refresh the product data
      const updatedProduct = await getproductByID(id);
      setProducts(updatedProduct.data);
      setVariants(updatedProduct.data.variants || []);
    } else {
      toast.error(response.error || "Failed to delete variant");
    }
  } catch (error) {
    console.error("Error deleting variant:", error);
    toast.error(error.response?.data?.message || "An error occurred while deleting the variant");
  }
};
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
    const selectedCategory = categories.find(
      (cat) => cat._id === selectedCategoryId
    );

    setSelectedCategory(selectedCategoryId);
    setIsKidsCategory(
      selectedCategory?.name.toLowerCase().includes("kids") || false
    );

    if (selectedCategoryId) {
      await fetchsubCategories(selectedCategoryId);
    } else {
      setSubCategories([]);
    }
  };

  const handleSubCategoryChange = (e) => {
    setSelectedSubCategory(e.target.value);
  };
  const handleColorChange = (hexColor) => {
    setColor(hexColor);

    const colorNames = ColorNamer(hexColor);
    const basicName = colorNames.basic[0]?.name;
    const htmlName = colorNames.html[0]?.name;
    const name = basicName || htmlName || "";

    setColorName(name);
  };

  
const handleVariantImageChange = (variantIndex, imageIndex, event) => {
  console.log('handleVariantImageChange called with:', {
    variantIndex,
    imageIndex,
    file: event?.target?.files?.[0]
  });

  if (event?.target?.files?.[0]) {
    const file = event.target.files[0];
    const previewUrl = URL.createObjectURL(file);
    
    console.log('Generated preview URL:', previewUrl);

    // Determine the key for the variant
    const variantKey = editingIndex !== null ? editingIndex : 'new';
    
    console.log('Current newVariantImages before update:', newVariantImages);
    console.log('Current variantPreviewImages before update:', variantPreviewImages);

    setNewVariantImages(prev => {
      const updated = {
        ...prev,
        [variantKey]: {
          ...prev[variantKey],
          [imageIndex]: file
        }
      };
      console.log('Updated newVariantImages:', updated);
      return updated;
    });

    setVariantPreviewImages(prev => {
      const updated = {
        ...prev,
        [variantKey]: {
          ...prev[variantKey],
          [imageIndex]: previewUrl
        }
      };
      console.log('Updated variantPreviewImages:', updated);
      return updated;
    });
  }
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

  const handleDeleteModalOpen = () => setShowDeleteModal(true);
  const handleDeleteModalClose = () => setShowDeleteModal(false);

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

 const openDeleteModal = (variantIndex, imageIndex, imageName) => {
  setImageToDelete({
    variantIndex,
    imageIndex,
    imageName
  });
  setIsModalOpen(true);
};

 

  const closeModal = () => {
    setIsModalOpen(false);
    setImageToDelete(null);
  };
const handleEditVariant = (index) => {
  console.log('Editing variant at index:', index);
  console.log('Current variant:', variants[index]);

  const variant = variants[index];
  setSelectedVariantIndex(index);
  setColor(variant.color);
  setColorName(variant.colorName || "");
  setwholesalePrice(variant.wholesalePrice);
  setPrice(variant.price);

  const sizeStockObj = {};
  variant.sizes.forEach(({ size, stock }) => {
    sizeStockObj[size] = stock;
  });
  setSizeStocks(sizeStockObj);
  setSelectedSizes(variant.sizes.map(({ size }) => size));
  setEditingIndex(index);

  console.log('Existing variant images:', variant.images);

  // Initialize preview images for this variant
  const previews = {};
  variant.images?.forEach((img, i) => {
    if (img instanceof File) {
      previews[i] = URL.createObjectURL(img);
      console.log(`Image ${i} is a File object, created preview URL`);
    } else if (typeof img === 'string') {
      previews[i] = `${BASE_URL}/uploads/${img}`;
      console.log(`Image ${i} is a string, using server URL`);
    }
  });
  
  console.log('Setting preview images:', previews);
  setVariantPreviewImages(prev => ({ ...prev, [index]: previews }));
};


// Update the handleAddVariant function
const handleAddVariant = () => {
  console.log('Adding/editing variant with data:', {
    color,
    colorName,
    wholesalePrice,
    price,
    sizeStocks,
    selectedSizes,
    editingIndex,
    variantPreviewImages,
    newVariantImages
  });

  if (!color || !colorName || Object.keys(sizeStocks).length === 0) {
    toast.error("Please fill in all required fields for the variant");
    return;
  }

  // Check for images (existing or new)
  const variantKey = editingIndex !== null ? editingIndex : 'new';
  const hasExistingImages = editingIndex !== null && variants[editingIndex]?.images?.length > 0;
  const hasNewImages = newVariantImages[variantKey] && 
                      Object.values(newVariantImages[variantKey] || {}).some(img => img !== null);

  console.log('Image check:', { hasExistingImages, hasNewImages });

  if (!hasExistingImages && !hasNewImages) {
    toast.error("At least one image is required for each variant");
    return;
  }

  const newVariant = {
    ...(editingIndex !== null && { _id: variants[editingIndex]._id }), // Keep _id if editing
    color,
    colorName,
    wholesalePrice: Number(wholesalePrice),
    price: Number(price),
    stock: Object.values(sizeStocks).reduce((sum, stock) => sum + Number(stock), 0),
    sizes: Object.entries(sizeStocks).map(([size, stock]) => ({
      size,
      stock: Number(stock)
    })),
    images: []
  };

  console.log('New variant object before images:', newVariant);

  // Keep existing images if editing
  if (editingIndex !== null && variants[editingIndex]?.images) {
    newVariant.images = [...variants[editingIndex].images];
    console.log('Kept existing images:', newVariant.images);
  }

  // Add new images if any
  if (newVariantImages[variantKey]) {
    console.log('Adding new images:', newVariantImages[variantKey]);
    // For new images, we'll handle them in the form submission
  }

  console.log('Final variant to add/update:', newVariant);

  // Update state
  if (editingIndex !== null) {
    setVariants(prev => {
      const updated = prev.map((v, i) => (i === editingIndex ? newVariant : v));
      console.log('Updated variants array:', updated);
      return updated;
    });
  } else {
    setVariants(prev => {
      const updated = [...prev, newVariant];
      console.log('Added new variant to array:', updated);
      return updated;
    });
  }

  // Reset form
  setColor("");
  setColorName("");
  setPrice("");
  setwholesalePrice("");
  setSelectedSizes([]);
  setSizeStocks({});
  setEditingIndex(null);
  
  // Clear preview images for the current variant
  setVariantPreviewImages(prev => {
    const newPreviews = {...prev};
    delete newPreviews[variantKey];
    console.log('Cleared preview images for variant:', variantKey);
    return newPreviews;
  });
};




  const productnavigation = () => {
    navigate("/products");
  };

const handleFormSubmit = async (e) => {
  e.preventDefault();

  // Validate at least one variant exists
  if (variants.length === 0) {
    toast.error("At least one variant is required");
    return;
  }

  // Separate variants into new and updated
  const newVariants = [];
  const updatedVariants = [];
  
  variants.forEach(variant => {
    if (variant._id) {
      // Existing variant - only include fields that can be updated
      updatedVariants.push({
        _id: variant._id,
        color: variant.color,
        colorName: variant.colorName,
        wholesalePrice: variant.wholesalePrice,
        price: variant.price,
        sizes: variant.sizes,
        stock: variant.stock
      });
    } else {
      // New variant
      newVariants.push({
        color: variant.color,
        colorName: variant.colorName,
        wholesalePrice: variant.wholesalePrice,
        price: variant.price,
        sizes: variant.sizes,
        stock: variant.stock
      });
    }
  });

  const formData = new FormData();

  // Add basic product info
  formData.append("name", productName);
  formData.append("description", description);
  formData.append("category", selectedCategory);
  formData.append("subcategory", selectedSubCategory);
  formData.append("brand", selectedBrand);
  formData.append("productType", selectedProductType);
  formData.append("owner", adminID);
  formData.append("isReturnable", isReturnable);
  formData.append("returnWithinDays", returnWithinDays);
  formData.append("CODAvailable", codAvailable);
  formData.append("cost", cost);

  // Add features
  const features = {
    material,
    sleevesType,
    soleMaterial,
    fit,
    length,
    occasion,
    netWeight
  };
  formData.append("features", JSON.stringify(features));

  // Add variants data
  if (newVariants.length > 0) {
    formData.append("newVariants", JSON.stringify(newVariants));
  }
  if (updatedVariants.length > 0) {
    formData.append("updatedVariants", JSON.stringify(updatedVariants));
  }

  // Handle image uploads
  Object.entries(newVariantImages).forEach(([variantKey, imagesObj]) => {
    const variantIndex = variantKey === 'new' ? variants.length - 1 : parseInt(variantKey);
    const variant = variants[variantIndex];
    
    // For new variants, use colorName as key
    const formDataKey = variant._id ? variant._id : variant.colorName.toLowerCase().replace(/\s+/g, '-');

    Object.entries(imagesObj || {}).forEach(([imgIndex, file]) => {
      if (file instanceof File) {
        formData.append(`variantImages[${formDataKey}]`, file);
      }
    });
  });

  try {
    const response = await updateproductapi(productId, formData);
    
    if (response.success) {
      toast.success("Product updated successfully!");
      const updatedProduct = await getproductByID(id);
      setProducts(updatedProduct.data);
      setVariants(updatedProduct.data.variants || []);
      
      // Clear the new images state after successful update
      setNewVariantImages({});
      setVariantPreviewImages({});
    } else {
      toast.error(response.error || "Failed to update product");
    }
  } catch (error) {
    console.error("Submission error:", error);
    toast.error(error.response?.data?.message || "An error occurred");
  }
};
const handleDeleteImageClick = (imageName) => {
  setDeleteImageModal({
    show: true,
    imageName
  });
};
  const handleCloseDeleteImageModal = () => {
    setDeleteImageModal({
      show: false,
      imageName: null
    });
  };

const confirmDeleteImage = async () => {
  const { imageName } = deleteImageModal;
  
  if (!imageName) {
    toast.error("No image selected for deletion");
    handleCloseDeleteImageModal();
    return;
  }

  try {
    // Determine if this is a variant image or main product image
    const isVariantImage = selectedVariantIndex !== null;
    const variantId = isVariantImage ? variants[selectedVariantIndex]?._id : null;

    const response = await deleteProductImageApi(productId, {
      imageName,
      variantId: variantId || "" // Send empty string if not a variant image
    });

    if (response.success) {
      toast.success("Image deleted successfully!");
      
      // Update the preview images state
      setVariantPreviewImages(prev => {
        const updated = {...prev};
        Object.keys(updated).forEach(variantKey => {
          Object.keys(updated[variantKey]).forEach(imgKey => {
            if (getImageNameFromPreview(updated[variantKey][imgKey]) === imageName) {
              delete updated[variantKey][imgKey];
            }
          });
        });
        return updated;
      });

      // Update the variants state if this was a variant image
      if (isVariantImage && variantId) {
        setVariants(prev => {
          return prev.map((variant, idx) => {
            if (idx === selectedVariantIndex) {
              return {
                ...variant,
                images: variant.images.filter(img => img !== imageName)
              };
            }
            return variant;
          });
        });
      }
    } else {
      toast.error(response.error || "Failed to delete image");
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    toast.error("An error occurred while deleting the image");
  } finally {
    handleCloseDeleteImageModal();
  }
};
  // Function to extract image name from preview URL
  const getImageNameFromPreview = (previewUrl) => {
    if (typeof previewUrl !== 'string') return null;
    
    // If it's a new image (blob URL), return the file name
    if (previewUrl.startsWith('blob:')) {
      const variantKey = selectedVariantIndex !== null ? selectedVariantIndex : 'new';
      const imageIndex = Object.values(variantPreviewImages[variantKey] || {}).indexOf(previewUrl);
      if (imageIndex !== -1 && newVariantImages[variantKey]?.[imageIndex]) {
        return newVariantImages[variantKey][imageIndex].name;
      }
      return null;
    }
    
    // If it's an existing image (from server), extract from URL
    const urlParts = previewUrl.split('/');
    return urlParts[urlParts.length - 1];
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
        {/* Main variant image */}
       {/* Main variant image */}
<div className="position-relative single-product-wrapper">
  {variantPreviewImages[selectedVariantIndex]?.[0] ? (
    <>
      <img
        src={variantPreviewImages[selectedVariantIndex][0]}
        alt="Main Variant Preview"
        className="single-product-img"
      />
      <i
        className="fa-solid fa-trash main-image-delete-icon"
        onClick={() => {
          const imageName = getImageNameFromPreview(variantPreviewImages[selectedVariantIndex][0]);
          handleDeleteImageClick(imageName);
        }}
      ></i>
    </>
  ) : variants[selectedVariantIndex]?.images?.[0] ? (
    <>
      <img
        src={`${BASE_URL}/uploads/${variants[selectedVariantIndex].images[0]}`}
        alt="Main Variant"
        className="single-product-img"
      />
      <i
        className="fa-solid fa-trash main-image-delete-icon"
        onClick={() => {
          handleDeleteImageClick(variants[selectedVariantIndex].images[0]);
        }}
      ></i>
    </>
  ) : (
    <div className="add-image-icon-large">
      +
      <input
        type="file"
        accept="image/*"
        className="image-input"
        onChange={(e) => handleVariantImageChange(selectedVariantIndex, 0, e)}
      />
    </div>
  )}
</div>

{/* Additional variant images */}
<Row className="mt-3">
  {[1, 2, 3, 4].map((imgIndex) => (
    <Col key={imgIndex} xs={3} className="position-relative">
      <div className="image-square">
        {variantPreviewImages[selectedVariantIndex]?.[imgIndex] ? (
          <>
            <img
              src={variantPreviewImages[selectedVariantIndex][imgIndex]}
              alt={`Variant Preview ${imgIndex}`}
              className="img-fluid added-image"
            />
            <i
              className="fa-solid fa-trash additional-image-delete-icon"
              onClick={() => {
                const imageName = getImageNameFromPreview(variantPreviewImages[selectedVariantIndex][imgIndex]);
                handleDeleteImageClick(imageName);
              }}
            ></i>
          </>
        ) : variants[selectedVariantIndex]?.images?.[imgIndex] ? (
          <>
            <img
              src={`${BASE_URL}/uploads/${variants[selectedVariantIndex].images[imgIndex]}`}
              alt={`Variant ${imgIndex}`}
              className="img-fluid added-image"
            />
            <i
              className="fa-solid fa-trash additional-image-delete-icon"
              onClick={() => {
                handleDeleteImageClick(variants[selectedVariantIndex].images[imgIndex]);
              }}
            ></i>
          </>
        ) : (
          <>
            <div className="add-image-icon">+</div>
            <input
              type="file"
              accept="image/*"
              className="image-input"
              onChange={(e) => handleVariantImageChange(selectedVariantIndex, imgIndex, e)}
            />
          </>
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
                      onChange={(e) => setSelectedBrand(e.target.value)}
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
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="single-product-form-label">
                    Cost
                  </Form.Label>
                  <Form.Control
                    className="single-product-form"
                    type="text"
                    placeholder="Enter cost"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

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
                      onChange={(e) => handleColorChange(e.target.value)}
                    />

                    <Form.Control
                      className="single-product-form w-auto"
                      type="text"
                      placeholder="Enter color name"
                      value={colorName}
                      onChange={(e) => setColorName(e.target.value)}
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
                    {(isKidsCategory ? kidSizes : adultSizes).map((size) => (
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
  const totalStock = variant.sizes.reduce((sum, { stock }) => sum + stock, 0);

  return (
    <div
      key={index}
      className="variant-card p-4 border rounded shadow-sm mb-4 position-relative"
      style={{
        backgroundColor: "#f9f9f9",
        borderLeft: `5px solid ${variant.color}`,
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
      <span
  className="position-absolute"
  style={{
    top: "10px",
    right: "40px", // Adjust this to position it left of the edit button
    cursor: "pointer",
  }}
  onClick={() => {
    if (variant._id) {
      handleDeleteVariant(variant._id);
    } else {
      // Handle case where variant hasn't been saved yet
      setVariants(prev => prev.filter((_, i) => i !== index));
      toast.success("Unsaved variant removed");
    }
  }}
>
  <i
    className="fas fa-trash"
    style={{
      fontSize: "20px",
      color: "#ff0000",
    }}
  ></i>
</span>

      <div className="row mb-3">
        <div className="col-md-6">
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
              {variant.colorName || "N/A"}{" "}
              <span
                style={{
                  display: "inline-block",
                  width: "20px",
                  height: "20px",
                  backgroundColor: variant.color,
                  borderRadius: "50%",
                  marginLeft: "12px",
                  verticalAlign: "middle",
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
                .map(({ size, stock }) => `${size} (${stock})`)
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
          {variant.images?.map((image, imgIndex) => {
            if (!image) return null;
            
            // Check if image is a string (existing) or File object (new)
            const isString = typeof image === 'string';
            const src = isString 
              ? `${BASE_URL}/uploads/${image}`
              : URL.createObjectURL(image);

            return (
              <div key={`variant-${index}-image-${imgIndex}`} className="position-relative me-2 mb-2" style={{ width: "80px", height: "80px" }}>
                <img
                  src={src}
                  alt={`Variant${index}Image ${imgIndex}`}
                  className="img-fluid"
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }}
                />
               
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </div>
  );
})}
            </div>
            <Row className="mb-3 mt-4">
              <Col md={12}>
                <h3 className="shipping-options-heading">
                  Shipping & Return Options
                </h3>
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
                    <Form.Label className="single-product-form-label">
                      Return Window (Days)
                    </Form.Label>
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
            Update
          </button>{" "}
        </Col>
      </Row>

     <Modal show={showDeleteModal} onHide={handleDeleteModalClose} centered>
  <Modal.Header closeButton>
    <Modal.Title>Confirm Product Deletion</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    Are you sure you want to delete this product? This action cannot be undone.
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleDeleteModalClose}>
      Cancel
    </Button>
    <Button variant="danger" onClick={handleDeleteConfirm}>
      Delete Product
    </Button>
  </Modal.Footer>
</Modal>

{/* Delete Image Modal */}
<Modal show={deleteImageModal.show} onHide={handleCloseDeleteImageModal} centered>
  <Modal.Header closeButton>
    <Modal.Title>Confirm Image Deletion</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    Are you sure you want to delete this image? This action cannot be undone.
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseDeleteImageModal}>
      Cancel
    </Button>
    <Button variant="danger" onClick={confirmDeleteImage}>
      Delete Image
    </Button>
  </Modal.Footer>
</Modal>
      <ToastContainer></ToastContainer>
    </div>
  );
}

export default SingleProduct;   