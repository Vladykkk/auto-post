import { Outlet, useLocation } from "react-router";

import Form from "@/components/Form";

function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {isHome ? <Form /> : <Outlet />}
      </div>
    </div>
  );
}

export default App;
