import api from "./api";

export const login = async ({ email, password }) => {
  const response = await api.post("/auth/login", { email, password });
  const { token, user } = response.data;
  return {
    token,
    user: {
      id: user.id || user._id,
      email: user.email,
      username: user.email.split("@")[0],
    },
  };
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  const user = response.data;
  return {
    id: user.id || user._id,
    email: user.email,
    username: user.email.split("@")[0],
  };
};
