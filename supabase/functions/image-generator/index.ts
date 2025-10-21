import { corsHeaders } from "./corsHeaders.ts";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  Deno.env.get("PROJECT_URL")?.replace("127.0.0.1", "host.docker.internal") ||
  "";
const supabaseServiceKey = Deno.env.get("SERVICE_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function base64ToBytes(base64: string) {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((bucket) => bucket.name === "images");

    if (!bucketExists) {
      const { data: bucketData, error: bucketError } = await supabase.storage
        .createBucket("images", {
          public: true,
        });

      if (bucketError) console.error("erro ao criar bucket", bucketError);
      else console.log("Bucket criado:", bucketData);
    }

    const { file, user_id } = await req.json();

    if (!file) {
      return new Response("Arquivo não enviado", {
        status: 400,
        headers: corsHeaders,
      });
    }
    const base64Data = file.includes(",") ? file.split(",")[1] : file;
    const cleanBase64 = base64Data.trim().replace(/\s/g, "");

    if (!cleanBase64 || cleanBase64.length < 100) {
      console.error("Base64 data failed pre-check.");
      throw new Error("Invalid base64 image data");
    }
    const fileBytes = base64ToBytes(cleanBase64);
    const mimeMatch = file.match(/data:(.*?);base64,/);
    const fileExtension = mimeMatch ? mimeMatch[1].split("/")[1] : "png";
    const mimeType = mimeMatch ? mimeMatch[1] : "image/png";
    const originalPath = `image-generator/${Date.now()}.${fileExtension}`;

    await supabase.storage.from("images").upload(originalPath, fileBytes, {
      contentType: mimeType,
      upsert: true,
    });

    const { data: originalUrlData } = supabase.storage.from("images")
      .getPublicUrl(originalPath);

    //para local:
    const originalUrl = originalUrlData.publicUrl.replace(
      "host.docker.internal",
      "localhost",
    );
    //para prod:
    // const originalUrl = originalUrlData.publicUrl;

    //para teste
    // const generatedUrls = [originalUrl, originalUrl];

    //  OPENAI ---------\/----------\\
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
        Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
      },
      body: form,
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("OpenAI erro:", errText);
      return new Response(`OpenAI erro: ${openaiRes.status}`, {
        status: 502,
        headers: corsHeaders,
      });
    }

    const openAiJson = await openaiRes.json() as {
      data: { b64_json: string }[];
    };
    if (!openAiJson?.data?.length) {
      return new Response("Resposta sem imagem da OpenAI", {
        status: 502,
        headers: corsHeaders,
      });
    }

    const b64 = openAiJson.data[0].b64_json;
    const outputBytes = base64ToBytes(b64);
    const filePath = `generated/${Date.now()}.png`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, outputBytes, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      console.error("Erro ao enviar imagem:", uploadError);
    }

    const { data: fileUrlData } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);

    if (fileUrlData?.publicUrl?.includes("host.docker.internal")) {
      fileUrlData.publicUrl = fileUrlData.publicUrl.replace(
        "host.docker.internal",
        "localhost",
      );
    }
    const generatedUrl = fileUrlData.publicUrl;

    const { data: inserted, error: dbError } = await supabase
      .from("images")
      .insert([
        {
          user_id,
          image_url: originalUrl,
          variation_url: generatedUrl,
          description: `Histórico ${Date.now()}`,
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Erro ao salvar no banco:", dbError);
      return new Response(
        JSON.stringify({ error: dbError.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    return new Response(
      JSON.stringify(inserted),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  } catch (e) {
    console.error("error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : String(e) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }
});
