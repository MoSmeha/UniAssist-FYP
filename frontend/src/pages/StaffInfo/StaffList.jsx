import { useState } from "react";
import TopBar from "../ChatApp/TopBarChat";
import AllStaff from "./AllStaff";
function StaffList() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <TopBar setSearchTerm={setSearchTerm} />
      <AllStaff searchTerm={searchTerm} />
    </>
  );
}
export default StaffList;
