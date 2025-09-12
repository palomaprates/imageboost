// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js";

const supabase = createClient(
 Deno.env.get("PROJECT_URL")!,
 Deno.env.get("SERVICE_ROLE_KEY")!
);

function base64ToBytes(base64: string) {
 const binary = atob(base64);
 const len = binary.length;
 const bytes = new Uint8Array(len);
 for (let i = 0; i < len; i++) {
   bytes[i] = binary.charCodeAt(i);
 }
 return bytes;
}

export default Deno.serve(async (req) => {
 const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
   "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
   "Access-Control-Max-Age": "86400",
 };
 if (req.method === "OPTIONS") {
   return new Response("ok", { headers: corsHeaders });
 }

 try {
   const formData = await req.formData();
   const file = formData.get("file") as File | null;
   const userId = formData.get("user_id") as string | null;
   if (!file) {
     return new Response("Arquivo não enviado ou usuário não identificado", { status: 400, headers: corsHeaders });
   }
   const originalPath = `hello-world/${Date.now()}-${file.name}`;
   await supabase.storage.from("images").upload(originalPath, file, {
     contentType: file.type || "image/png",
     upsert: true,
   });
   const { data: originalUrlData } = supabase.storage.from("images").getPublicUrl(originalPath);
   const originalUrl = originalUrlData.publicUrl;

   // const prompt =
   //   "Enhance this food photo while keeping all original food elements and their exact positions. Improve sharpness, resolution, and clarity to make the dish look vivid, fresh, and highly appetizing. Use natural lighting and realistic textures, enhancing contrast and vibrancy in a balanced way that highlights the ingredients and details. Always remove forks, knives, or any cutlery from the image. Do not add or invent elements that were not in the original dish. The final result should be high-resolution, realistic, and visually irresistible.";

   // const form = new FormData();
   // form.append("model", "gpt-image-1");
   // form.append("prompt", prompt);
   // form.append("size", "1024x1024");
   // form.append("image", file);
   // form.append("n", "2");

   // const openaiRes = await fetch("https://api.openai.com/v1/images/edits", {
   //   method: "POST",
   //   headers: {
   //     Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
   //   },
   //   body: form,
   // });

   // if (!openaiRes.ok) {
   //   const errText = await openaiRes.text();
   //   console.error("OpenAI erro:", errText);
   //   return new Response(`OpenAI erro: ${openaiRes.status}`, {
   //     status: 502,
   //     headers: corsHeaders,
   //   });
   // }

   // const openAiJson = await openaiRes.json() as { data: { b64_json: string }[] };
   // if (!openAiJson?.data?.length) {
   //   return new Response("Resposta sem imagem da OpenAI", {
   //     status: 502,
   //     headers: corsHeaders,
   //   });
   // }

   // const generatedUrls: string[] = [];
   // for (let i = 0; i < openAiJson.data.length; i++) {
   //   const b64 = openAiJson.data[i].b64_json;
   //   const imgBytes = base64ToBytes(b64);
   //   const filePath = `generated/${Date.now()}-${i}.png`;

   //   await supabase.storage.from("images").upload(filePath, imgBytes, {
   //     contentType: "image/png",
   //     upsert: true,
   //   });

   //   const { data } = supabase.storage.from("images").getPublicUrl(filePath);
   //   generatedUrls.push(data.publicUrl);
   // }

   const generatedUrls = [originalUrl,originalUrl]

   const { error: dbError } = await supabase
     .from("images")
     .insert([
       {
         user_id: userId || null,
         image_url: originalUrl,
         variation_urls: generatedUrls,
       }
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
     { headers: { "Content-Type": "application/json", ...corsHeaders } }
   );

 } catch (e) {
   console.error("error", e);
   return new Response(
     JSON.stringify({ error: e.message }),
     { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
   );
 }
});



/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/image-edit' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
