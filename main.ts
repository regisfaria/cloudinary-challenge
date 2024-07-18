import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD,
  api_key: process.env.KEY,
  api_secret: process.env.SECRET,
});

const uploadImage = async (imagePath) => {
  const options = {
    use_filename: true,
    unique_filename: true,
    overwrite: true,
  };

  try {
    const result = await cloudinary.uploader.upload(imagePath, options);

    console.log(result);
    return result.public_id;
  } catch (error) {
    console.error(error);
  }
};

const createImageTagFace = (publicId) => {
  let imageTag = cloudinary.image(publicId, {
    transformation: [
      { gravity: "face", height: 400, width: 400, crop: "crop" },
      { fetch_format: "auto" },
    ],
    quality: 100,
  });

  return imageTag;
};

const createImageTagRecolored = (publicId, color) => {
  let imageTag = cloudinary.image(publicId, {
    effect: `gen_recolor:prompt_the bag;to-color_${color}`,
    quality: "auto",
    fetch_format: "auto",
  });

  return imageTag;
};

void async function main() {
  const guyId = await uploadImage(process.env.IMG1_URL);
  const bagId = await uploadImage(process.env.IMG2_URL);

  const faceTag = createImageTagFace(guyId);

  const greyTag = createImageTagRecolored(bagId, "grey");
  const greenTag = createImageTagRecolored(bagId, "green");

  console.log("Guy: ", faceTag);
  console.log("Grey bag: ", greyTag);
  console.log("Green bag: ", greenTag);
};
