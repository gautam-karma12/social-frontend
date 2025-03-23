import api from "./apiService";

// Sign Up Function
export const signUp = async (data) => {
	try {
		const response = await api.post("/sign-up", data);
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || "Something went wrong!";
	}
};

// Login Function (Example)
export const login = async (data) => {
	try {
		const response = await api.post("/sign-in", data);
		if (response.data.data.token) {
			localStorage.setItem("token", response.data.data.token);
		}
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || "Login failed!";
	}
};

export const getProfileData = async () => {
	try {
		const response = await api.get("/profile");
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || "not fetched";
	}
};
