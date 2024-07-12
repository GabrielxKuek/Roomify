import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import supabase from "@/lib/supabase";

function Home() {
  const navigate = useNavigate();
  const [roomID, setRoomID] = useState<string>();

  async function roomExist(roomID: string) {
    const { data, error } = await supabase
      .from("roomify_room")
      .select()
      .eq("id", roomID);
    if (error) {
      toast.error(error.message);
      return false;
    }
    return data.length > 0;
  }

  async function joinRoom() {
    let room = roomID?.trim();
    if (!room) {
      return toast.error("Invalid Room ID");
    }
    let exist = await roomExist(room);
    if (!exist) {
      return toast.error("Room Do Not Exist");
    }
    return navigate(`/${room}`);
  }

  async function createRoom() {
    let room = roomID?.trim();
    if (!room) {
      return toast.error("Invalid Room ID");
    }
    let exist = await roomExist(room);
    if (exist) {
      return toast.error("Room Already Exist");
    }
    return navigate(`/${room}`);
  }

  return (
    <div className="flex justify-center items-center h-full flex-col mx-auto max-w-xs p-5 gap-5">
      <h1 className="text-2xl font-bold">Roomify</h1>
      <div className="grid w-full max-w-sm items-center gap-2">
        <Label htmlFor="roomID">Room ID</Label>
        <Input
          type="text"
          id="roomID"
          placeholder="Room ID"
          onInput={(e) => setRoomID((e.target as HTMLInputElement).value)}
        />
      </div>
      <div className="flex justify-between items-center w-full">
        <Button variant={"default"} onClick={joinRoom}>
          Join Room
        </Button>
        <Button variant={"secondary"} onClick={createRoom}>
          Create Room
        </Button>
      </div>
    </div>
  );
}

export default Home;
