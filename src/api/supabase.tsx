import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// room and user
const { room_id } = useParams();
const user_id = uuidv4();

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

async function uploadImageAndBroadcast(file: Blob) {
    let filePath = `${String(new Date().getTime())}_${room_id}.jpeg`;
    const { data, error } = await supabase.storage
      .from("unspoken_image")
      .upload(filePath, file);

    if (error) {
      return console.log(error);
    }
    console.log(data.path);
    channel?.send({
      type: "broadcast",
      event: "getImage",
      payload: {
        imgURL:
          import.meta.env.VITE_SUPABASE_URL +
          "/storage/v1/object/public/unspoken_image/" +
          data.path,
      },
    });
    // setImgURL(
    //   import.meta.env.VITE_SUPABASE_URL +
    //     "/storage/v1/object/public/unspoken_image/" +
    //     data.path
    // );
    // setIsPlay2(true);
    // setLoading(false);

}
