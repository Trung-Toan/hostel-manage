import { useGetAllUser } from "../fetchData/DataFetch";

function useLogin() {
  const { users, loadingUser } = useGetAllUser();

  const loginToSystem = (username, password) => {
    let findUser = null;

    if (loadingUser) return { findUser, loadingUser: true };

    findUser = users.find(
      (u) =>
        (u.username === username || u.email === username) &&
        u.password === password
    );

    return { findUser, loadingUser: false };
  };

  const findEmail = async (email) => {
    return users.find((u) => u.email === email);
  }

  return { loginToSystem, loadingUser, findEmail };
}

export { useLogin };
