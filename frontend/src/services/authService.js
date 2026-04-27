const authService = {
  login: async (data) => {
    console.log("LOGIN:", data);
    return new Promise((resolve) => setTimeout(resolve, 500));
  },

  register: async (data) => {
    console.log("REGISTER:", data);
    return new Promise((resolve) => setTimeout(resolve, 500));
  }
};

export default authService;