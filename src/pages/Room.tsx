import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ARButton, XR } from "@react-three/xr";
import Overlay from "@/components/Overlay";
import { Canvas } from "@react-three/fiber";
import XRGallery from "@/components/XRGallery";
import Calibration from "@/components/Calibration";
import supabase from "@/lib/supabase";
import { RealtimeChannel, RealtimePresenceState } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { BsInfoLg } from "react-icons/bs";
import { FaUser, FaPaintBrush } from "react-icons/fa";
import { MdOutlineContentCopy } from "react-icons/md";
import { toast } from "sonner";
import * as THREE from "three";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Toaster } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LuUpload } from "react-icons/lu";

type UserType = {
  user_id: string;
  username: string;
  presence_ref: string;
};

const user_id = uuidv4();

function Room() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<RealtimePresenceState>({});
  const [channel, setChannel] = useState<RealtimeChannel>();
  const [color, setColor] = useState<string>("pink");
  const { room_id } = useParams();
  const [isOverlayVisible, setOverlayVisible] = useState<boolean>(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [sessionInit, setSessionInit] = useState<any>(null);
  const [referencePoint, setReferencePoint] = useState<THREE.Vector3 | null>(
    null
  );
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [instructions, setInstructions] = useState<string>("asdqq\nasd");

  useEffect(() => {
    let value = sessionStorage.getItem("showInstructions");
    if (value) {
      setShowInstructions(value == "true");
    } else {
      sessionStorage.setItem("showInstructions", "false");
    }
    console.log("hi");
  }, []);

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
    setOverlayVisible((prevState) => !prevState);
  };

  const handleButtonClick = () => {
    setColor("blue");
  };

  function copyText() {
    toast.success("Room ID copied!");
    navigator.clipboard.writeText(
      `${import.meta.env.VITE_CLIENT_URL}/?roomID=${room_id}`
    );
  }

  useEffect(() => {
    if (!room_id) {
      navigate("/");
    }
    if (!sessionStorage.getItem("name")) {
      navigate("/");
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
        const plainObject: any = {};

        for (const key in newState) {
          if (newState.hasOwnProperty(key)) {
            plainObject[key] = newState[key];
          }
        }
        setUsers(plainObject);
      })
      .on("presence", { event: "join" }, async ({ key, newPresences }) => {
        console.log("join", key, newPresences);
      })
      .on("presence", { event: "leave" }, async ({ key, leftPresences }) => {
        console.log("leave", key, leftPresences);
      });

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
    if (referencePoint) {
      setInstructions("Calibration In Progress...\n");
    }
  }, [referencePoint]);

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
          {referencePoint ? (
            <XRGallery
              color={color}
              referencePoint={referencePoint}
              channel={channel}
            />
          ) : (
            <Calibration onCalibrate={setReferencePoint} />
          )}
        </XR>
      </Canvas>

      <Overlay ref={overlayRef} visible={isOverlayVisible}>
        <div className="flex justify-between items-center space-x-4 px-3">
          <div className="bg-white dark:bg-[#080c15] h-12 flex items-center justify-center shadow-lg rounded-b-lg px-3 gap-2">
            <h1>RoomID: {room_id}</h1>
            <Button
              onClick={() => {
                copyText();
              }}
              variant={"ghost"}
              size={"sm"}
            >
              <MdOutlineContentCopy />
            </Button>
          </div>
          <Button
            className="rounded-full"
            onClick={() => setShowInstructions((prev) => !prev)}
            size={"sm"}
            variant={"secondary"}
          >
            <BsInfoLg />
          </Button>
        </div>
        <div
          className={
            showInstructions
              ? "flex flex-col dark:bg-[#080c15]/10 bg-white/10 py-2 px-4 rounded-lg absolute top-20 left-0 right-0 w-fit mx-auto"
              : "hidden"
          }
        >
          {instructions.split("\n").map((e, i) => {
            return <span key={i}>{e}</span>;
          })}
        </div>
        <Button onClick={handleButtonClick} className="hidden">
          as
        </Button>

        <div className="button-container mt-20 flex flex-col w-fit bg-white dark:bg-[#080c15] rounded-r-lg">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"ghost"}>
                <FaPaintBrush size={20} />
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-[425px]"
              container={overlayRef.current as Element}
            >
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"ghost"}>
                <LuUpload size={20} />
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-[425px]"
              container={overlayRef.current as Element}
            >
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"ghost"}>
                <FaUser size={20} />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-36 flex flex-col justify-center items-center"
              container={overlayRef.current as Element}
            >
              <h1 className="underline underline-offset-1">Users</h1>
              <ul className="list-disc">
                {Object.entries(users).map((e) => {
                  return (
                    <li className="" key={e[0]}>
                      {(e[1][0] as UserType).username}
                    </li>
                  );
                })}
              </ul>
            </PopoverContent>
          </Popover>
        </div>

        <Toaster richColors />
      </Overlay>
    </>
  );
}

export default Room;
