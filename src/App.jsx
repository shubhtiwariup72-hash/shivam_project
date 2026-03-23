import { Routes, Route } from "react-router-dom";
import SignupFlow from "./authnavigation/SignupFlow";
import MainScreen from "./mainscreen/MainScreen";
import ProductScreen from "./mainscreen/ProductScreen";

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<MainScreen />} />
      <Route
        path="/dashboard/brand/:brandId/products"
        element={<ProductScreen />}
      />
      <Route path="*" element={<SignupFlow />} />
    </Routes>
  );
}

export default App;
