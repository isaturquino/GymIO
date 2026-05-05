import api from "./api";

const authService = {
  login: async ({ email, senha }) => {
    const response = await api.post("/auth/login", {
      email,
      senha,
    });

    return response.data;
  },
};

export default authService;