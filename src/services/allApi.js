import axios from "axios";
import { BASE_URL } from "./baseUrl";
import { commonApi } from "./commonApi";

export const adminLoginApi = async (loginData) => {
  const url = `${BASE_URL}/admin/auth/login`;
  return await commonApi("POST", url, loginData);
};

export const getCategoriesApi = async () => {
  const url = `${BASE_URL}/admin/category/view`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return {
      success: false,
      error: error.message || "Error fetching categories",
    };
  }
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    return { success: false, error: "No refresh token available" };
  }

  try {
    const response = await axios.post(`${BASE_URL}/token/refresh-token`, {
      refreshToken,
    });

    if (response.data.accessToken) {
      return { success: true, accessToken: response.data.accessToken };
    } else {
      return { success: false, error: "Invalid refresh token" };
    }
  } catch (error) {
    return { success: false, error: "Failed to refresh token" };
  }
};

export const getDashboardProductContentApi = async () => {
  const url = `${BASE_URL}/admin/dashboard/products`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching dashboard content",
    };
  }
};
export const getDashboardOrdersContentApi = async () => {
  const url = `${BASE_URL}/admin/dashboard/orders`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching dashboard content",
    };
  }
};
export const getDashboardUserContentApi = async () => {
  const url = `${BASE_URL}/admin/dashboard/users`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching dashboard content",
    };
  }
};


export const getDashboardRevenueApi = async (filterType = '') => {
  const url = `${BASE_URL}/admin/dashboard/revenue${filterType ? `?type=${filterType}` : ''}`;
  const accessToken = localStorage.getItem("accessToken");
  
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch revenue data');
    }
    
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching revenue data",
    };
  }
};



export const getDashboardCommissionApi = async (filterType = '') => {
  const url = `${BASE_URL}/admin/dashboard/commission-revenue${filterType ? `?type=${filterType}` : ''}`;
  const accessToken = localStorage.getItem("accessToken");
  
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch revenue data');
    }
    
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching revenue data",
    };
  }
};





export const getAdminOrdersApi = async () => {
  const url = `${BASE_URL}/admin/orders`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching admin orders",
    };
  }
};

export const createAffordableProductApi = async (formData) => {
  const url = `${BASE_URL}/admin/homepageedit/affordable/create`;
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("POST", url, formData, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error creating product" };
  }
};

export const getAllAffordableProductsApi = async () => {
  const url = `${BASE_URL}/admin/homepageedit/view`;
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching products",
    };
  }
};

export const updateAffordableProductApi = async (id, formData) => {
  const url = `${BASE_URL}/admin/homepageedit/affordable/update/${id}`;
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, formData, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error updating product" };
  }
};

export const deleteAffordableProductApi = async (id) => {
  const url = `${BASE_URL}/admin/homepageedit/affordable/delete/${id}`;
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("DELETE", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error deleting product" };
  }
};

export const getLowestPriceProductApi = async () => {
  const url = `${BASE_URL}/admin/homepageedit/lowest-price/view`;
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching products",
    };
  }
};

export const createLowestPriceProductApi = async (formData) => {
  const url = `${BASE_URL}/admin/homepageedit/lowest-price/create`;
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) return { success: false, error: "No token provided" };

  try {
    const response = await commonApi("POST", url, formData, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    });
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error creating product" };
  }
};

export const deleteLowestPriceProductApi = async (id) => {
  const url = `${BASE_URL}/admin/homepageedit/lowest-price/delete/${id}`;
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) return { success: false, error: "No token provided" };

  try {
    const response = await commonApi("DELETE", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error deleting product" };
  }
};
export const updateLowestPriceProductApi = async (id, formData) => {
  const url = `${BASE_URL}/admin/homepageedit/lowest-price/update/${id}`;
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) return { success: false, error: "No token provided" };

  try {
    const response = await commonApi("PATCH", url, formData, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    });
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error updating product" };
  }
};
export const createTopPickProductApi = async (formData) => {
  const url = `${BASE_URL}/admin/homepageedit/top-pick/create`;
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) return { success: false, error: "No token provided" };

  try {
    const response = await commonApi("POST", url, formData, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    });
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error creating product" };
  }
};
export const updateTopPickProductApi = async (id, formData) => {
  const url = `${BASE_URL}/admin/homepageedit/top-pick/update/${id}`;
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) return { success: false, error: "No token provided" };

  try {
    const response = await commonApi("PATCH", url, formData, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    });
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error updating product" };
  }
};
export const getAllTopPickProductsApi = async () => {
  const url = `${BASE_URL}/admin/homepageedit/top-pick/view`;
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) return { success: false, error: "No token provided" };

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching top picks",
    };
  }
};
export const createTopSaleProductApi = async (formData) => {
  const url = `${BASE_URL}/admin/homepageedit/top-sale/create`;
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) return { success: false, error: "No token provided" };

  try {
    const response = await commonApi("POST", url, formData, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error creating top sale product",
    };
  }
};
export const updateTopSaleProductApi = async (id, formData) => {
  const url = `${BASE_URL}/admin/homepageedit/top-sale/update/${id}`;
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) return { success: false, error: "No token provided" };

  try {
    const response = await commonApi("PATCH", url, formData, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error updating top sale product",
    };
  }
};
export const getAllTopSaleProductsApi = async () => {
  const url = `${BASE_URL}/admin/homepageedit/top-sale/view`;
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) return { success: false, error: "No token provided" };

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching top sale products",
    };
  }
};

// Create Offer
export const createrefferalOfferApi = async (formData) => {
  const url = `${BASE_URL}/admin/homepageedit/offer/create`;
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) return { success: false, error: "No token provided" };

  try {
    const response = await commonApi("POST", url, formData, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error creating offer" };
  }
};

// Update Offer
export const updaterefferalOfferApi = async (id, formData) => {
  const url = `${BASE_URL}/admin/homepageedit/offer/update/${id}`;
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) return { success: false, error: "No token provided" };

  try {
    const response = await commonApi("PATCH", url, formData, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error updating offer" };
  }
};

// Delete Offer
export const deleterefferalOfferApi = async (id) => {
  const url = `${BASE_URL}/admin/homepageedit/offer/delete/${id}`;
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) return { success: false, error: "No token provided" };

  try {
    const response = await commonApi("DELETE", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error deleting offer" };
  }
};

// View All Offers
export const getAllrefferalOffersApi = async () => {
  const url = `${BASE_URL}/admin/homepageedit/offer/view`;
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) return { success: false, error: "No token provided" };

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error fetching offers" };
  }
};

export const updateAdminOrderStatusApi = async (orderData) => {
  const url = `${BASE_URL}/admin/orders/`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, orderData, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error updating order status",
    };
  }
};

export const getCoinSettingsApi = async () => {
  const url = `${BASE_URL}/admin/coin/view`;
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) return { success: false, error: "No token provided" };

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching coin settings",
    };
  }
};

export const updateCoinSettingsApi = async (formData) => {
  const url = `${BASE_URL}/admin/coin/update`;
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) return { success: false, error: "No token provided" };

  try {
    const response = await commonApi("PUT", url, formData, {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error updating coin settings",
    };
  }
};

export const createCategoryApi = async (categoryData) => {
  const url = `${BASE_URL}/admin/category/create`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("POST", url, categoryData, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return {
      success: false,
      error: error.message || "Error creating category",
    };
  }
};

export const updateCategoryApi = async (categoryId, categoryData) => {
  const url = `${BASE_URL}/admin/category/update/${categoryId}`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, categoryData, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error updating sub category",
    };
  }
};

export const deleteCategoryApi = async (categoryId) => {
  const url = `${BASE_URL}/admin/category/delete/${categoryId}`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("DELETE", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error deleting category",
    };
  }
};

export const getSubCategoriesApi = async () => {
  const url = `${BASE_URL}/admin/subcategory/get`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return {
      success: false,
      error: error.message || "Error fetching subcategories",
    };
  }
};

const getToken = () => localStorage.getItem("accessToken");

export const createBrandApi = async (data) => {
  const url = `${BASE_URL}/admin/brand/create`;
  const accessToken = getToken();

  if (!accessToken) return { success: false, error: "No token provided" };

  try {
    const response = await commonApi("POST", url, data, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error creating brand" };
  }
};

// Get All Brands
export const getAllBrandsApi = async () => {
  const url = `${BASE_URL}/admin/brand/view`;
  const accessToken = getToken();

  if (!accessToken) return { success: false, error: "No token provided" };

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error fetching brands" };
  }
};

// Get Brand by ID
export const getBrandByIdApi = async (brandId) => {
  const url = `${BASE_URL}/admin/brand/view/${brandId}`;
  const accessToken = getToken();

  if (!accessToken) return { success: false, error: "No token provided" };

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching brand details",
    };
  }
};

// Update Brand
export const updateBrandApi = async (brandId, data) => {
  const url = `${BASE_URL}/admin/brand/update/${brandId}`;
  const accessToken = getToken();

  if (!accessToken) return { success: false, error: "No token provided" };

  try {
    const response = await commonApi("PATCH", url, data, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error updating brand" };
  }
};

// Delete Brand
export const deleteBrandApi = async (brandId) => {
  const url = `${BASE_URL}/admin/brand/delete/${brandId}`;
  const accessToken = getToken();

  if (!accessToken) return { success: false, error: "No token provided" };

  try {
    const response = await commonApi("DELETE", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error deleting brand" };
  }
};
export const createSubCategoryApi = async (categoryData) => {
  const url = `${BASE_URL}/admin/subcategory/create`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("POST", url, categoryData, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return {
      success: false,
      error: error.message || "Error creating sub category",
    };
  }
};

export const updateSubCategoryApi = async (subcategoryId, categoryData) => {
  const url = `${BASE_URL}/admin/subcategory/update/${subcategoryId}`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, categoryData, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error updating sub category",
    };
  }
};

export const getsubcategoryByID = async (categoryId) => {
  const url = `${BASE_URL}/admin/subcategory/view/subcategory/${categoryId}`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return {
      success: false,
      error: error.message || "Error fetching subcategory",
    };
  }
};

export const deleteSubCategoryApi = async (subcategoryId) => {
  const url = `${BASE_URL}/admin/subcategory/delete/${subcategoryId}`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("DELETE", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error deleting subcategory",
    };
  }
};

export const getCouponApi = async () => {
  const url = `${BASE_URL}/admin/coupon/get`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return { success: false, error: error.message || "Error fetching coupons" };
  }
};

export const getCouponbyID = async (couponId) => {
  const url = `${BASE_URL}/admin/coupon/${couponId}`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return { success: false, error: error.message || "Error fetching coupon" };
  }
};

export const createcouponApi = async (couponData) => {
  const url = `${BASE_URL}/admin/coupon/create`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("POST", url, couponData, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return { success: false, error: error.message || "Error creating offer" };
  }
};

export const updatecouponApi = async (couponId, CouponData) => {
  const url = `${BASE_URL}/admin/coupon/update/${couponId}`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, CouponData, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error updating Coupon " };
  }
};

export const deletecouponApi = async (couponId) => {
  const url = `${BASE_URL}/admin/coupon/delete/${couponId}`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("DELETE", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error deleting Coupon" };
  }
};

export const getOfferApi = async () => {
  const url = `${BASE_URL}/admin/offer/get`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return { success: false, error: error.message || "Error fetching offers" };
  }
};

export const getOfferbyID = async (chappalId) => {
  const url = `${BASE_URL}/admin/offer/get/${chappalId}`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return {
      success: false,
      error: error.message || "Error fetching Chappals",
    };
  }
};

export const createofferApi = async (offerData) => {
  const url = `${BASE_URL}/admin/offer/create`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("POST", url, offerData, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return { success: false, error: error.message || "Error creating offer" };
  }
};

export const updateofferApi = async (offerId, categoryData) => {
  const url = `${BASE_URL}/admin/offer/update/${offerId}`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, categoryData, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error updating Offer " };
  }
};

export const deleteOfferApi = async (offerId) => {
  const url = `${BASE_URL}/admin/offer/delete/${offerId}`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("DELETE", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error deleting Offer" };
  }
};

export const getSliderApi = async () => {
  const url = `${BASE_URL}/admin/slider/get`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return { success: false, error: error.message || "Error fetching Sliders" };
  }
};

export const createsliderApi = async (sliderdata) => {
  const url = `${BASE_URL}/admin/slider/create`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("POST", url, sliderdata, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return { success: false, error: error.message || "Error creating slider" };
  }
};

export const updatesliderApi = async (sliderid, categoryData) => {
  const url = `${BASE_URL}/admin/slider/update/${sliderid}`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, categoryData, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error updating slider " };
  }
};

export const deletesliderApi = async (sliderId) => {
  const url = `${BASE_URL}/admin/slider/delete/${sliderId}`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("DELETE", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error deleting Slider" };
  }
};

export const getCategorySliderApi = async () => {
  const url = `${BASE_URL}/admin/slider/category/get`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return { success: false, error: error.message || "Error fetching Sliders" };
  }
};

export const createCategorysliderApi = async (sliderdata) => {
  const url = `${BASE_URL}/admin/slider/category/create`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("POST", url, sliderdata, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return { success: false, error: error.message || "Error creating slider" };
  }
};

export const updateCategorysliderApi = async (sliderid, categoryData) => {
  const url = `${BASE_URL}/admin/slider/category/update/${sliderid}`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, categoryData, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error updating slider " };
  }
};

export const deleteCategorysliderApi = async (sliderId) => {
  const url = `${BASE_URL}/admin/slider/category/delete/${sliderId}`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("DELETE", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error deleting Slider" };
  }
};

export const getBrandSliderApi = async () => {
  const url = `${BASE_URL}/admin/slider/brand/get`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return { success: false, error: error.message || "Error fetching Sliders" };
  }
};

export const createBrandsliderApi = async (sliderdata) => {
  const url = `${BASE_URL}/admin/slider/brand/create`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("POST", url, sliderdata, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return { success: false, error: error.message || "Error creating slider" };
  }
};

export const updateBrandsliderApi = async (sliderid, categoryData) => {
  const url = `${BASE_URL}/admin/slider/brand/update/${sliderid}`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, categoryData, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error updating slider " };
  }
};



export const deleteBrandsliderApi = async (sliderId) => {
  const url = `${BASE_URL}/admin/slider/brand/delete/${sliderId}`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("DELETE", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error deleting Slider" };
  }
};

export const getnotificationApi = async () => {
  const url = `${BASE_URL}/admin/notification/get`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return {
      success: false,
      error: error.message || "Error fetching notification",
    };
  }
};

export const createnotificationApi = async (sliderdata) => {
  const url = `${BASE_URL}/admin/notification/create`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("POST", url, sliderdata, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return { success: false, error: error.message || "Error creating slider" };
  }
};

export const notifyUserApi = async (data) => {
  const url = `${BASE_URL}/admin/notification/notify-user`;

  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("POST", url, data, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error notifying user" };
  }
};

export const notifyAllUsersApi = async (data) => {
  const url = `${BASE_URL}/admin/notification/notify-all-users`;

  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("POST", url, data, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error notifying all users",
    };
  }
};

export const updatenotificationapi = async (sliderid, categoryData) => {
  const url = `${BASE_URL}/admin/notification/update/${sliderid}`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, categoryData, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error updating slider " };
  }
};

export const deletenotificationapi = async (notificationId) => {
  const url = `${BASE_URL}/admin/notification/delete/${notificationId}`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("DELETE", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error deleting Slider" };
  }
};

export const getallUserApi = async () => {
  const url = `${BASE_URL}/admin/user/get`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return { success: false, error: error.message || "Error fetching users" };
  }
};

export const getUserByID = async (userId) => {
  const url = `${BASE_URL}/admin/user/get/${userId}`;

  
  const accessToken = localStorage.getItem("accessToken");

  
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  
  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    
    return { success: false, error: error.message || "Error fetching single user" };
  }
};


export const getallProducts = async () => {
  const url = `${BASE_URL}/admin/product/get`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return {
      success: false,
      error: error.message || "Error fetching products",
    };
  }
};

export const getproductByID = async (productId) => {
  const url = `${BASE_URL}/admin/product/get/${productId}`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return { success: false, error: error.message || "Error fetching product" };
  }
};

export const createProductApi = async (productdata) => {
  const url = `${BASE_URL}/admin/product/create`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("POST", url, productdata, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return { success: false, error: error.message || "Error creating product" };
  }
};

export const getChappal = async () => {
  const url = `${BASE_URL}/admin/product/chappal/get`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return {
      success: false,
      error: error.message || "Error fetching Chappals",
    };
  }
};

export const getChappalbyID = async (chappalId) => {
  const url = `${BASE_URL}/admin/product/chappal/get//${chappalId}`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return {
      success: false,
      error: error.message || "Error fetching Chappals",
    };
  }
};

export const updateproductapi = async (productId, categoryData) => {
  const url = `${BASE_URL}/admin/product/update/${productId}`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, categoryData, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error updating Product ",
    };
  }
};

export const deleteProductImageApi = async (productId, payload) => {
  const url = `${BASE_URL}/admin/product/delete/${productId}/image`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("DELETE", url, payload, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error deleting product image",
    };
  }
};

export const deleteProductVariantApi = async (productId, variantId, payload) => {
  const url = `${BASE_URL}/admin/product/delete/${productId}/variant/${variantId}`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("DELETE", url, payload, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error deleting product variant",
    };
  }
};


export const deletevendorproductvariant = async (productId, variantId, payload) => {
  const url = `${BASE_URL}/vendor/product/delete/${productId}/variant/${variantId}`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("DELETE", url, payload, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error deleting product variant",
    };
  }
};
export const deleteProductapi = async (productId) => {
  const url = `${BASE_URL}/admin/product/delete/${productId}`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("DELETE", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error deleting Product" };
  }
};

export const getallVendors = async () => {
  const url = `${BASE_URL}/admin/vendor/get`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return { success: false, error: error.message || "Error fetching vendor" };
  }
};

export const getAllVendorBrandsApi = async () => {
  const url = `${BASE_URL}/vendor/brand/view`;
  const accessToken = getToken();

  if (!accessToken) return { success: false, error: "No token provided" };

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error fetching brands" };
  }
};

export const createVendorApi = async (vendorData) => {
  const url = `${BASE_URL}/admin/vendor/create`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("POST", url, vendorData, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return { success: false, error: error.message || "Error creating vendor" };
  }
};

export const getVendorbyID = async (vendorId) => {
  const url = `${BASE_URL}/admin/vendor/get/${vendorId}`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return { success: false, error: error.message || "Error fetching Venor" };
  }
};


export const updateVendorStatusApi = async (vendorId, status) => {
  const url = `${BASE_URL}/admin/vendor/${vendorId}/status`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, { status }, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error updating vendor status" };
  }
};


export const deleteVendorApi = async (vendorId) => {
  const url = `${BASE_URL}/admin/vendor/delete/${vendorId}`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("DELETE", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error deleting vendor" };
  }
};

export const deleteVendorImageApi = async (vendorId) => {
  const url = `${BASE_URL}/admin/vendor/delete-vendor-image/${vendorId}`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("DELETE", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error deleting vendor image",
    };
  }
};

export const updatevendorapi = async (VendorId, VendorData) => {
  const url = `${BASE_URL}/admin/vendor/update/${VendorId}`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, VendorData, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error updating Vendor " };
  }
};



// Get all vendor payouts
export const getAllVendorPayoutsApi = async () => {
  const url = `${BASE_URL}/admin/vendorpayout/view`;
  const accessToken = localStorage.getItem("accessToken");
  
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }
  
  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error fetching vendor payouts" };
  }
};

// Get payouts for a specific vendor
export const getVendorPayoutsByVendorIdApi = async (vendorId) => {
  const url = `${BASE_URL}/admin/vendor/payouts/${vendorId}`;
  const accessToken = localStorage.getItem("accessToken");
  
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }
  
  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });
    
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error fetching vendor payouts" };
  }
};

// Update payout status (pending to paid or vice versa)
export const updateVendorPayoutStatusApi = async (statusData) => {
  const url = `${BASE_URL}/admin/vendorpayout/update`;
  const accessToken = localStorage.getItem("accessToken");
  
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }
  
  try {
    const response = await commonApi("PUT", url, statusData, {
      Authorization: `Bearer ${accessToken}`,
    });
    
    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error updating payout status" };
  }
};





export const searchUsers = async (name, phone) => {
  // Initialize the base URL
  let url = `${BASE_URL}/admin/user/search`;

  // Construct query parameters conditionally
  const params = new URLSearchParams();
  if (name) params.append("name", name);
  if (phone) params.append("phone", phone);

  // Append the query parameters to the URL
  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error searching for users",
    };
  }
};

// Vendor Apis

export const venodorLoginApi = async (loginData) => {
  const url = `${BASE_URL}/vendor/auth/login`;
  return await commonApi("POST", url, loginData);
};
export const getVendorDashboardProductApi = async () => {
  const url = `${BASE_URL}/vendor/dashboard/products`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching dashboard content",
    };
  }
};
export const getVendorDashboardOrderApi = async () => {
  const url = `${BASE_URL}/vendor/dashboard/orders`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching dashboard content",
    };
  }
};

export const getVendorCategoriesApi = async () => {
  const url = `${BASE_URL}/vendor/category/view`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return {
      success: false,
      error: error.message || "Error fetching categories",
    };
  }
};

export const getVendorSubCategoriesApi = async () => {
  const url = `${BASE_URL}/vendor/subcategory/view`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return {
      success: false,
      error: error.message || "Error fetching subcategories",
    };
  }
};

export const getvendorsubcategoryByID = async (categoryId) => {
  const url = `${BASE_URL}/vendor/subcategory/view/subcategory/${categoryId}`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return {
      success: false,
      error: error.message || "Error fetching subcategory",
    };
  }
};

export const getvendornotificationApi = async () => {
  const url = `${BASE_URL}/vendor/notification/get`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return {
      success: false,
      error: error.message || "Error fetching notification",
    };
  }
};

export const createvendornotificationApi = async (sliderdata) => {
  const url = `${BASE_URL}/vendor/notification/create`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("POST", url, sliderdata, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return { success: false, error: error.message || "Error creating slider" };
  }
};

export const updatevendornotificationapi = async (sliderid, categoryData) => {
  const url = `${BASE_URL}/vendor/notification/update/${sliderid}`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, categoryData, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error updating slider " };
  }
};

export const deletevendornotificationapi = async (notificationId) => {
  const url = `${BASE_URL}/vendor/notification/delete/${notificationId}`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("DELETE", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error deleting Slider" };
  }
};

export const getvendorSliderApi = async () => {
  const url = `${BASE_URL}/vendor/slider/get`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return { success: false, error: error.message || "Error fetching Sliders" };
  }
};

export const createvendorsliderApi = async (sliderdata) => {
  const url = `${BASE_URL}/vendor/slider/create`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("POST", url, sliderdata, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return { success: false, error: error.message || "Error creating slider" };
  }
};

export const updatevendorsliderApi = async (sliderid, categoryData) => {
  const url = `${BASE_URL}/vendor/slider/update/${sliderid}`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, categoryData, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error updating slider " };
  }
};

export const deletevendorsliderApi = async (sliderId) => {
  const url = `${BASE_URL}/vendor/slider/delete/${sliderId}`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("DELETE", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error deleting Slider" };
  }
};

export const getvendorOfferApi = async () => {
  const url = `${BASE_URL}/vendor/offer/get`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return { success: false, error: error.message || "Error fetching offers" };
  }
};

export const getvendorOfferbyID = async (offerId) => {
  const url = `${BASE_URL}/vendor/offer/get/${offerId}`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return {
      success: false,
      error: error.message || "Error fetching Chappals",
    };
  }
};

export const createvendorofferApi = async (offerData) => {
  const url = `${BASE_URL}/vendor/offer/create`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("POST", url, offerData, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return { success: false, error: error.message || "Error creating offer" };
  }
};

export const updatevendorofferApi = async (offerId, categoryData) => {
  const url = `${BASE_URL}/vendor/offer/update/${offerId}`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, categoryData, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error updating Offer " };
  }
};

export const deletevendorOfferApi = async (offerId) => {
  const url = `${BASE_URL}/vendor/offer/delete/${offerId}`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("DELETE", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error deleting Offer" };
  }
};

export const getvendorCouponApi = async () => {
  const url = `${BASE_URL}/vendor/coupon/get`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return { success: false, error: error.message || "Error fetching coupons" };
  }
};

export const getvendorCouponbyID = async (couponId) => {
  const url = `${BASE_URL}/vendor/coupon/get/${couponId}`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return { success: false, error: error.message || "Error fetching coupon" };
  }
};

export const createvendorcouponApi = async (couponData) => {
  const url = `${BASE_URL}/vendor/coupon/create`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("POST", url, couponData, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return { success: false, error: error.message || "Error creating offer" };
  }
};

export const updatevendorcouponApi = async (couponId, CouponData) => {
  const url = `${BASE_URL}/vendor/coupon/update/${couponId}`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, CouponData, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error updating Coupon " };
  }
};

export const deletevendorcouponApi = async (couponId) => {
  const url = `${BASE_URL}/vendor/coupon/delete/${couponId}`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("DELETE", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error deleting Coupon" };
  }
};

export const getVendorOrdersApi = async () => {
  const url = `${BASE_URL}/vendor/orders`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error fetching admin orders",
    };
  }
};

export const updateVendorOrderStatusApi = async (orderData) => {
  const url = `${BASE_URL}/vendor/orders/`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, orderData, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error updating order status",
    };
  }
};

export const getallvendorProducts = async () => {
  const url = `${BASE_URL}/vendor/product/get`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return {
      success: false,
      error: error.message || "Error fetching products",
    };
  }
};

export const getvendorproductByID = async (productId) => {
  const url = `${BASE_URL}/vendor/product/get/${productId}`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("GET", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return { success: false, error: error.message || "Error fetching product" };
  }
};

export const createvendorProductApi = async (productdata) => {
  const url = `${BASE_URL}/vendor/product/create`;

  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");

  // Check if the token exists
  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  // If the token exists, make the API request with the token in the headers
  try {
    const response = await commonApi("POST", url, productdata, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    // Handle any error in the API request
    return { success: false, error: error.message || "Error creating product" };
  }
};

export const updatevendorproductapi = async (productId, categoryData) => {
  const url = `${BASE_URL}/vendor/product/update/${productId}`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("PATCH", url, categoryData, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error updating Product ",
    };
  }
};

export const deletevendorProductImageApi = async (productId, payload) => {
  const url = `${BASE_URL}/vendor/product/delete/${productId}/image`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("DELETE", url, payload, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error deleting product image",
    };
  }
};

export const deletevendorProductapi = async (productId) => {
  const url = `${BASE_URL}/vendor/product/delete/${productId}`;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return { success: false, error: "No token provided" };
  }

  try {
    const response = await commonApi("DELETE", url, null, {
      Authorization: `Bearer ${accessToken}`,
    });

    return response;
  } catch (error) {
    return { success: false, error: error.message || "Error deleting Product" };
  }
};
