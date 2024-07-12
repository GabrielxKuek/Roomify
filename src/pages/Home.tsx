import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import supabase from "@/lib/supabase";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Home() {
  const query = useQuery();
  const navigate = useNavigate();
  const [name, setName] = useState<string>();
  const [roomID, setRoomID] = useState<string>();

  useEffect(() => {
    if (query.get("roomID")) {
      setRoomID(query.get("roomID") || "");
    }
  }, [query]);

  async function validName() {
    if (!name?.trim()) {
      toast.error("Missing Name");
      return false;
    }
    sessionStorage.setItem("name", name.trim());
    return true;
  }

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
    let isValid = validName();
    if (!isValid) {
      return;
    }
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
    let isValid = validName();
    if (!isValid) {
      return;
    }
    let room = roomID?.trim();
    if (!room) {
      return toast.error("Invalid Room ID");
    }
    let exist = await roomExist(room);
    if (exist) {
      return toast.error("Room Already Exist");
    }
    const { error } = await supabase.from("roomify_room").insert({ id: room });
    if (error) {
      toast.error(error.message);
      return false;
    }
    return navigate(`/${room}`);
  }

  return (
    <div className="flex justify-center items-center h-full flex-col mx-auto max-w-xs p-5 gap-5">
      <h1 className="text-2xl font-bold">Roomify</h1>
      <div className="grid w-full max-w-sm items-center gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          placeholder="Name"
          value={name}
          onInput={(e) => setName((e.target as HTMLInputElement).value)}
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-2">
        <Label htmlFor="roomID">Room ID</Label>
        <Input
          type="text"
          id="roomID"
          value={roomID}
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
