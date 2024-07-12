// Room.tsx
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ARButton, XR } from "@react-three/xr";
import Overlay from "@/components/Overlay";
import { Canvas } from "@react-three/fiber";
import XRGallery from "@/components/XRGallery";

function Room() {
  const { room_id } = useParams();
  const [isOverlayVisible, setOverlayVisible] = useState<boolean>(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [sessionInit, setSessionInit] = useState<any>(null);

  useEffect(() => {
    console.log(overlayRef.current);
    if (overlayRef.current) {
      setSessionInit({
        requiredFeatures: ["hit-test", "local-floor"],
        optionalFeatures: ["dom-overlay", "bounded-floor"],
        domOverlay: { root: overlayRef.current },
      });
    }
  }, [overlayRef.current]);

  const handleARButtonClick = () => {
    setOverlayVisible(true);
  };

  return (
    <>
      {sessionInit && (
        <ARButton
          className="ar-button"
          sessionInit={sessionInit}
          onClick={handleARButtonClick}
        />
      )}
      <Canvas>
        <XR>
          <XRGallery />
        </XR>
      </Canvas>
      <Overlay ref={overlayRef} visible={isOverlayVisible}>
        <h1>Welcome to the AR Experience! {room_id}</h1>
        <p>Click anywhere to close this overlay.</p>
      </Overlay>
    </>
  );
}

export default Room;
