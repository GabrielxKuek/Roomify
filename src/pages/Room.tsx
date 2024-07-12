import { useParams } from "react-router-dom";

function Room() {
  const { room_id } = useParams();

  return <div>Room {room_id}</div>;
}

export default Room;
