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
    // mr hong yu. it doesnt toggle, but im thinking its because the button that says "exit AR" is made by stuff thats in charge of ar
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
        <div className="flex justify-center items-center space-x-4 w-[70vw] px-0 mx-auto"> 
          <h1 className="bg-black flex-grow h-24 flex items-center justify-center shadow-lg border-2 border-white rounded-lg">
            RoomID: {room_id}
          </h1>
          <img src="assets/informationIcon.png" alt="Info" className="w-12 h-12 rounded-full ring-2 ring-white" onClick={handleButtonClick}/>
        </div>

        <div className="mt-20">
          <img src="assets/inventoryIcon.png" alt="Inventory" className="w-20 h-20 p-2 mb-4 border-2 border-white rounded-lg" onClick={handleButtonClick}/>
          <img src="assets/search.svg" alt="Search" className="w-20 h-20 p-2 mb-4 border-2 border-white rounded-lg" onClick={handleButtonClick}/>
          <img src="assets/profileIcon.png" alt="Profile" className="w-20 h-20 p-2 mb-4 border-2 border-white rounded-lg" onClick={handleButtonClick}/>
        </div>

        <Button className="fixed inset-x-0 bottom-4 w-[70vw] h-24 mx-auto shadow-lg border-2 border-white rounded-lg" onClick={handleARButtonClick}>Exit AR</Button>
      </Overlay>
    </>
  );
}

export default Room;
