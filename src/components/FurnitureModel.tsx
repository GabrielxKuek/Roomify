import React from "react";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import * as THREE from "three";

interface FurnitureModelProps extends React.ComponentProps<"mesh"> {
  mtlUrl?: string;
  objUrl: string;
  ghost?: number;
}

const FurnitureModel: React.FC<FurnitureModelProps> = ({
  mtlUrl,
  objUrl,
  ghost = 0,
  ...props
}) => {
  let materials: any;
  if (mtlUrl) {
    materials = useLoader(MTLLoader, mtlUrl);
  }
  const obj = useLoader(OBJLoader, objUrl, (loader) => {
    if (materials) {
      materials.preload();
      loader.setMaterials(materials);
    }
  });

  if (ghost) {
    obj.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((material) => {
            material.transparent = true;
            material.opacity = ghost; // Set your desired opacity here
          });
        } else {
          mesh.material.transparent = true;
          mesh.material.opacity = ghost; // Set your desired opacity here
        }
      }
    });
  }

  return <primitive object={obj} {...props} />;
};

export default FurnitureModel;
