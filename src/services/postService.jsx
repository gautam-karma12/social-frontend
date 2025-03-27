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
export const addComment = async (postId,data) => {
	try {
		const response = await api.post(`/post/add-comment/${postId}`,data);
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || "not fetched";
	}
};
export const likePost = async (postId) => {
	try {
		const response = await api.post(`/post/${postId}`);
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || "not fetched";
	}
};
export const unLikePost = async (postId) => {
	try {
		const response = await api.delete(`/post/${postId}`);
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || "not fetched";
	}
};
export const updatePost = async (postId,data) => {
	try {
		const response = await api.put(`/post-update/${postId}`,data);
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || "not fetched";
	}
};
export const deletePost = async (postId) => {
	try {
		const response = await api.delete(`/delete-post/${postId}`);
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || "not fetched";
	}
};
export const followUser = async (userId) => {
	try {
		const response = await api.post(`/follow/${userId}`);
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || "not fetched";
	}
};
export const unfollowUser = async (userId) => {
	try {
		const response = await api.delete(`/un-follow/${userId}`);
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || "not fetched";
	}
};