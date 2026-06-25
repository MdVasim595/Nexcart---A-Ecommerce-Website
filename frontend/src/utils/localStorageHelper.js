export const getData = (key) => {
  return JSON.parse(localStorage.getItem(key)) || [];
};

export const setData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const logoutUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};
