import React, { Fragment, useState, useRef, useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Interactive, useHitTest, useXR } from "@react-three/xr";
import * as THREE from "three";
import FurnitureModel from "./FurnitureModel";

interface Model {
  position: THREE.Vector3;
  id: number;
}

const XRGallery: React.FC<any> = ({
  color = "white",
  referencePoint,
  channel,
}) => {
  const reticleRef = useRef<THREE.Mesh>(null);
  const { isPresenting } = useXR();
  const { camera } = useThree();

  useEffect(() => {
    if (!isPresenting) {
      camera.position.z = 3;
    }
  }, [isPresenting, camera]);

  const [models, setModels] = useState<Model[]>([]);

  useHitTest((hitMatrix: THREE.Matrix4) => {
    if (reticleRef.current) {
      hitMatrix.decompose(
        reticleRef.current.position,
        reticleRef.current.quaternion,
        reticleRef.current.scale
      );
      reticleRef.current.rotation.set(-Math.PI / 2, 0, 0);
    }
  });

  const placeModel = () => {
    if (reticleRef.current) {
      const position = reticleRef.current.position.clone().sub(referencePoint);

      const model = { position, id: Date.now() };

      setModels((prevModels) => [...prevModels, model]);
      if (channel) {
        channel.send({
          type: "broadcast",
          event: "place-model",
          payload: {
            hi: "h",
            user: sessionStorage.getItem("name"),
          },
        });
      }
    }
  };

  useEffect(() => {
    if (channel) {
      channel.on("broadcast", { event: "place-model" }, (payload: any) => {
        console.log(payload);
      });
    }
  }, [channel]);

  return (
    <>
      <OrbitControls />
      <ambientLight />
      {models.map(({ position, id }) => (
        <Fragment key={id}>
          <mesh
            position={position.add(referencePoint)}
            scale={[0.3, 0.3, 0.3]}
            castShadow={true}
          >
            <boxGeometry />
            <meshStandardMaterial color={color} />
          </mesh>
        </Fragment>
      ))}
      <Interactive onSelect={placeModel}>
        <FurnitureModel
          ref={reticleRef}
          objUrl={
            "https://hlzsmadaanjcpyjghntc.supabase.co/storage/v1/object/public/roomify/tmpzego89o7.obj"
          }
          ghost={0.4}
        />
        {/* <mesh ref={reticleRef} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[0.1, 0.25, 32]} />
          <meshStandardMaterial color={"white"} />
        </mesh> */}
      </Interactive>
    </>
  );
};

export default XRGallery;
