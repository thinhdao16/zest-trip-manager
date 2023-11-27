import { BounceLoader } from "react-spinners";

const LoadingModal = (loading) => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      background: "rgba(255, 255, 255,0.5)",
      backdropFilter: "blur(5px)",
    }}
  >
    <BounceLoader size={50} color="#05445E" loading={loading} />
  </div>
);

export default LoadingModal;
