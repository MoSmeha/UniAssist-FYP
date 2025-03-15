import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../zustand/AuthStore";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthStore();

  const login = async (uniId, password) => {
    const success = handleInputErrors(uniId, password);
    if (!success) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uniId, password }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      localStorage.setItem("chat-user", JSON.stringify(data));
      setAuthUser(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
};
export default useLogin;

function handleInputErrors(uniId, password) {
  if (!uniId || !password) {
    toast.error("Please fill in all fields");
    return false;
  }

  return true;
}
