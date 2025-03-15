import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useGetStaff = () => {
  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    const getStaff = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        // Filter staff members
        const staffRoles = ["teacher", "admin"];
        const staffOnly = data.filter((user) => staffRoles.includes(user.role));
        setStaff(staffOnly);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    getStaff();
  }, []);

  return { loading, staff };
};

export default useGetStaff;
