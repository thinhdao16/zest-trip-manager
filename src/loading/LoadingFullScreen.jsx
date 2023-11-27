import PacmanLoader from "react-spinners/PacmanLoader";

const LoadingFullScreen = (loading) => (
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
      background: "white",
    }}
  >
    <PacmanLoader size={50} color="#05445E" loading={loading} />
  </div>
);

export default LoadingFullScreen;
