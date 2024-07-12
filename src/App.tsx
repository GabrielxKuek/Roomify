import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Room from "./pages/Room";
import Error from "./pages/404";
import Layout from "./pages/Layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/:room_id" element={<Room />} />
        {/* 404 ERROR */}
        <Route path="/*" element={<Error />} />
      </Route>
    </Routes>
  );
}

export default App;
