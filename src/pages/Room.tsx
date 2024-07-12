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

  // i didnt use test. caused bugs, so i just add this
  console.log(test);

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
    setOverlayVisible(prevState => !prevState);
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
        <div className="flex justify-center items-center space-x-4 px-0"> 

          <h1 className="bg-black w-max h-24 flex items-center justify-center shadow-lg border-2 border-white rounded-lg">RoomID: {room_id}</h1>

          <img src="assets/informationIcon.png" alt="Info" className="w-12 h-12 rounded-full ring-2 ring-white" onClick={handleButtonClick}/>
        </div>

        <div className="mt-20">
          <img src="assets/inventoryIcon.png" alt="Inventory" className="w-20 h-20 p-2 mb-4 border-2 border-white rounded-lg" onClick={handleButtonClick}/>
          <img src="assets/search.svg" alt="Search" className="w-20 h-20 p-2 mb-4 border-2 border-white rounded-lg" onClick={handleButtonClick}/>
          <img src="assets/profileIcon.png" alt="Profile" className="w-20 h-20 p-2 mb-4 border-2 border-white rounded-lg" onClick={handleButtonClick}/>
        </div>

        <Button className="w-10/12 h-24 mt-96 shadow-lg border-2 border-white rounded-lg" onClick={handleARButtonClick}>Exit AR</Button>
      </Overlay>
    </>
  );
}

export default Room;
