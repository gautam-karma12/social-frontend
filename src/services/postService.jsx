import api from "./apiService";

// Sign Up Function
export const UploadImage = async (data) => {
	try {
		const response = await api.post("/upload-image", data);
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || "Something went wrong!";
	}
};
export const createOwnPost = async (data) => {
	try {
		const response = await api.post("/create-post", data);
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || "Something went wrong!";
	}
};

export const getOwnPost = async () => {
	try {
		const response = await api.get("/get-own-post");
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || "not fetched";
	}
};
export const getAllOtherPost = async () => {
	try {
		const response = await api.get("/get-all-post");
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || "not fetched";
	}
};