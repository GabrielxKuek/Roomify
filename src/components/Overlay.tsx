// components/Overlay.tsx
import React from "react";

interface OverlayProps {
  visible: boolean;
  children?: React.ReactNode;
  onClick: () => void;
}

const Overlay = React.forwardRef<HTMLDivElement, OverlayProps>(
  ({ visible, children, onClick }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          display: visible ? "block" : "none",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "#fff",
          zIndex: 1000,
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "20px",
        }}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }
);

export default Overlay;
