import React, { useState, useRef } from "react";
import { Interactive } from "@react-three/xr";
import * as THREE from "three";

const Calibration: React.FC<{
  onCalibrate: (position: THREE.Vector3) => void;
}> = ({ onCalibrate }) => {
  const [calibrated, setCalibrated] = useState(false);
  const ref = useRef<THREE.Mesh>(null);

  const handleCalibrate = () => {
    if (ref.current) {
      onCalibrate(ref.current.position.clone());
      setCalibrated(true);
    }
  };

  return (
    <>
      <ambientLight />
      <Interactive onSelect={handleCalibrate}>
        <mesh ref={ref} visible={!calibrated} position={[0, 0, -2]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </Interactive>
    </>
  );
};

export default Calibration;
