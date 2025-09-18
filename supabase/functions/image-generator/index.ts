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
  const { data, error } = await supabase
    .from("users")
    .select("*");

  console.log("data", data);
  console.log("error", error);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const { data, error } = await supabase.storage.createBucket("images", {
      public: true,
    });

    if (error) console.error(error);
    else console.log("Bucket criado:", data);
    const { file, user_id } = await req.json();
    if (!file) {
      return new Response("Arquivo não enviado", {
        status: 400,
        headers: corsHeaders,
      });
    }
    const base64Data = file.includes(",") ? file.split(",")[1] : file;
    const fileBytes = base64ToBytes(base64Data);
    const mimeMatch = file.match(/data:(.*);base64,/);
    const fileExtension = mimeMatch ? mimeMatch[1].split("/")[1] : "png";
    const originalPath = `image-generator/${Date.now()}.${fileExtension}`;

    await supabase.storage.from("images").upload(originalPath, fileBytes, {
      contentType: `image/${fileExtension}`,
      upsert: true,
    });

    const { data: originalUrlData } = supabase.storage.from("images")
      .getPublicUrl(originalPath);

    // const originalUrl = originalUrlData.publicUrl;
    //apenas para local
    const originalUrl = originalUrlData.publicUrl.replace(
      "host.docker.internal",
      "localhost",
    );
    //para teste
    const generatedUrls = [originalUrl, originalUrl];

    const { error: dbError } = await supabase
      .from("images")
      .insert([
        {
          user_id,
          image_url: originalUrl,
          variations_url: generatedUrls,
        },
      ])
      .select();

    if (dbError) {
      console.error("Erro ao salvar no banco:", dbError);
      return new Response("Falha ao salvar no banco", {
        status: 500,
        headers: corsHeaders,
      });
    }

    return new Response(
      JSON.stringify({ original: originalUrl, variations: generatedUrls }),
      { headers: { "Content-Type": "application/json", ...corsHeaders } },
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
