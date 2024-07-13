import React, { Fragment, useState, useRef, useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Interactive, useHitTest, useXR } from "@react-three/xr";
import * as THREE from "three";
import FurnitureModel from "./FurnitureModel";
import supabase from "@/lib/supabase";
import { toast } from "sonner";

interface Model {
  position: THREE.Vector3;
  id: number;
}

const XRGallery: React.FC<any> = ({
  referencePoint,
  channel,
  objUrl,
  room,
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

  const placeModel = async () => {
    if (reticleRef.current) {
      const position = reticleRef.current.position.clone().sub(referencePoint);

      const model = { position, id: Date.now() };

      setModels((prevModels) => [...prevModels, model]);
      if (channel) {
        channel.send({
          type: "broadcast",
          event: "place-model",
          payload: {
            objUrl: objUrl,
            position: position,
            user: sessionStorage.getItem("name"),
          },
        });
        const { error } = await supabase
          .from("roomify_models_room")
          .insert({ room: room, model: objUrl, position: position });
        if (error) {
          return toast.error("Error");
        }
      }
    }
  };

  function convertToVector3(position: { x: number; y: number; z: number }) {
    return new THREE.Vector3(position.x, position.y, position.z);
  }

  useEffect(() => {
    async function getModels() {
      const { data, error } = await supabase
        .from("roomify_models_room")
        .select()
        .eq("room", room);
      if (error) {
        return toast.error("Error");
      }
      if (data) {
        for (let model of data) {
          setModels((prevModels) => [
            ...prevModels,
            { position: convertToVector3(model.position), id: Date.now() },
          ]);
        }
      }
    }
    getModels();
  }, []);

  useEffect(() => {
    if (channel) {
      channel.on("broadcast", { event: "place-model" }, (payload: any) => {
        console.log(payload);
        setModels((prevModels) => [
          ...prevModels,
          { position: convertToVector3(payload.position), id: Date.now() },
        ]);
      });
    }
  }, [channel]);

  return (
    <>
      <OrbitControls />
      <ambientLight />
      {models.map(({ position, id }) => (
        <Fragment key={id}>
          <FurnitureModel
            position={position.add(referencePoint)}
            ref={reticleRef}
            objUrl={objUrl}
            scale={[0.5, 0.5, 0.5]}
            key={id}
          />
        </Fragment>
      ))}
      <Interactive onSelect={placeModel}>
        <mesh ref={reticleRef} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[0.1, 0.25, 32]} />
          <meshStandardMaterial color={"white"} />
        </mesh>
      </Interactive>
    </>
  );
};

export default XRGallery;
