// hooks/useUserSchedule.js
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const useUserSchedule = (userId) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch(`/api/user/${userId}/schedule`, {
          credentials: "include", // Ensure cookies are sent
        });

        // Check content type before parsing
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid response format");
        }

        const data = await response.json();
        if (response.ok) {
          setSchedule(data.schedule);
        } else {
          throw new Error(data.message || "Failed to fetch schedule");
        }
      } catch (error) {
        toast.error(error.message);
        setSchedule([]); // Ensure schedule is reset on error
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchSchedule();
    }
  }, [userId]);

  return { schedule, loading };
};

export default useUserSchedule;
