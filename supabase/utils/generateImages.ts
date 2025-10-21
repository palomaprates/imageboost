import { OPENAI_KEY } from "../functions/image-generator";
import { base64ToBytes } from "./base64ToBytes";

export async function generateImages({ cleanBase64 }) {
  const prompt =
    "Enhance this food photo while keeping all original food elements and their exact positions. Improve sharpness, resolution, and clarity to make the dish look vivid, fresh, and highly appetizing. Use natural lighting and realistic textures, enhancing contrast and vibrancy in a balanced way that highlights the ingredients and details. Always remove forks, knives, or any cutlery from the image. Do not add or invent elements that were not in the original dish. The final result should be high-resolution, realistic, and visually irresistible.";

  const blob = new Blob([base64ToBytes(cleanBase64)], { type: "image/png" });

  const form = new FormData();
  form.append("model", "gpt-image-1");
  form.append("prompt", prompt);
  form.append("size", "1024x1024");
  form.append("image", blob, "image.png");
  form.append("n", "1");

  const openaiRes = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: form,
  });
  return openaiRes;
}
