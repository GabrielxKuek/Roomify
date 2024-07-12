import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ARButton, XR } from "@react-three/xr";
import Overlay from "@/components/Overlay";
import { Canvas } from "@react-three/fiber";
import XRGallery from "@/components/XRGallery";
import supabase from "@/lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const user_id = uuidv4();

function Room() {
  const navigate = useNavigate();
  const [channel, setChannel] = useState<RealtimeChannel>();
  const [color, setColor] = useState<string>("pink");
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
    // mr hong yu. it doesnt toggle, but im thinking its because the button that says "exit AR" is made by stuff thats in charge of ar
    setOverlayVisible((prevState) => !prevState);
  };

  const handleButtonClick = () => {
    setColor("blue");
  };

  useEffect(() => {
    if (!room_id) {
      navigate("/");
    }
    if (!sessionStorage.getItem("name")) {
    }
    let channel = supabase.channel(`${room_id}_roomify`, {
      config: {
        broadcast: {
          self: true,
        },
        presence: {
          key: user_id,
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, async () => {
        const newState = channel.presenceState();
        console.log("sync", newState);
      })
      .on("presence", { event: "join" }, async ({ key, newPresences }) => {
        console.log("join", key, newPresences);
      })
      .on("presence", { event: "leave" }, async ({ key, leftPresences }) => {
        console.log("leave", key, leftPresences);
      });

    channel.on;

    channel.subscribe(async (status) => {
      if (status !== "SUBSCRIBED") {
        return;
      }

      const presenceTrackStatus = await channel.track({
        user_id: user_id,
        username: sessionStorage.getItem("name"),
      });
      console.log(presenceTrackStatus);
    });
    setChannel(channel);

    return () => {
      channel.unsubscribe();
      setChannel(undefined);
    };
  }, []);

  useEffect(() => {
    if (channel) {
      console.log(channel);
    }
  }, [channel]);

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
        <div className="flex justify-center items-center space-x-4 px-0 ">
          <h1 className="bg-black flex-grow h-12 flex items-center justify-center shadow-lg rounded-lg">
            RoomID: {room_id}
          </h1>
          <img
            src="assets/informationIcon.png"
            alt="Info"
            className="w-12 h-12 rounded-full ring-2 ring-white"
            onClick={handleButtonClick}
          />
        </div>

        <div className="mt-20">
          <img
            src="assets/inventoryIcon.png"
            alt="Inventory"
            className="w-20 h-20 p-2 mb-4 rounded-lg"
            onClick={handleButtonClick}
          />
          <img
            src="assets/search.svg"
            alt="Search"
            className="w-20 h-20 p-2 mb-4 rounded-lg"
            onClick={handleButtonClick}
          />
          <img
            src="assets/profileIcon.png"
            alt="Profile"
            className="w-20 h-20 p-2 mb-4 rounded-lg"
            onClick={handleButtonClick}
          />
        </div>
      </Overlay>
    </>
  );
}

export default Room;
