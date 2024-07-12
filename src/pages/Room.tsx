import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ARButton, XR } from "@react-three/xr";
import Overlay from "@/components/Overlay";
import { Canvas } from "@react-three/fiber";
import XRGallery from "@/components/XRGallery";
import { Button } from "@/components/ui/button";

function Room() {
  const [color, setColor] = useState<string>("pink");
  const [test, setTest] = useState<string>("");
  const { room_id } = useParams();
  const [isOverlayVisible, setOverlayVisible] = useState<boolean>(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [sessionInit, setSessionInit] = useState<any>(null);

  useEffect(() => {
    console.log(overlayRef.current);
    if (overlayRef.current) {
      setSessionInit({
        requiredFeatures: ["hit-test", "local"],
        optionalFeatures: ["dom-overlay", "bounded-floor"],
        domOverlay: { root: overlayRef.current },
      });
    }
  }, [overlayRef.current]);

  const handleARButtonClick = () => {
    setOverlayVisible(true);
  };

  const handleButtonClick = () => {
    setColor("blue");
    setTest("asdas");
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
          <XRGallery color={color} />
        </XR>
      </Canvas>
      <Overlay ref={overlayRef} visible={isOverlayVisible}>
        <h1>Welcome to the AR Experience! {room_id}</h1>
        <p>Click anywhere to close this overlay. {test}</p>
        <Button onClick={handleButtonClick}>TEST</Button>
      </Overlay>
    </>
  );
}

export default Room;
