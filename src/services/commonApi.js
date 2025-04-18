import axios from "axios";
import { refreshAccessToken } from "./allApi";


let onTokenExpiredCallback = null;

export const setOnTokenExpired = (callback) => {
    onTokenExpiredCallback = callback;
};

export const commonApi = async (method, url, reqBody, reqHeader = { "Content-Type": "application/json" }) => {
    let accessToken = localStorage.getItem("accessToken");

    const config = {
        method,
        url,
        data: reqBody,
        headers: { ...reqHeader, Authorization: `Bearer ${accessToken}` },
    };

    try {
        const result = await axios(config);
        return { success: true, data: result.data, status: result.status };
    } catch (error) {
        const status = error.response ? error.response.status : 500;

        if (status === 401) {
            // Attempt to refresh the token
            const refreshResult = await refreshAccessToken();
            if (refreshResult.success) {
                // Retry the request with new token
                config.headers.Authorization = `Bearer ${refreshResult.accessToken}`;
                try {
                    const retryResult = await axios(config);
                    return { success: true, data: retryResult.data, status: retryResult.status };
                } catch (retryError) {
                    return { success: false, error: retryError.response?.data || "Request failed after refresh", status: retryError.response?.status || 500 };
                }
            } else {
                // Refresh failed, trigger modal
                if (onTokenExpiredCallback) {
                    onTokenExpiredCallback();
                }
            }
        }

        return {
            success: false,
            error: error.response ? error.response.data : error.message,
            status,
        };
    }
};
