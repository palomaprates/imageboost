import { corsHeaders } from "./corsHeaders.ts";
import { createClient } from "@supabase/supabase-js";
import { base64ToBytes } from "../../utils/base64ToBytes.ts";
import {
  createPartFromUri,
  createUserContent,
  GoogleGenAI,
} from "@google/genai";

export const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Não autenticado");
    }
    const supabase = createClient(
      Deno.env.get("PROJECT_URL") ?? "",
      Deno.env.get("ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
      },
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("Não autenticado");
    }
    await supabase.from("users").insert([{ id: user?.id, email: user?.email }]);

    const { file } = await req.json();
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
    const originalPath =
      `${user.id}/image-generator/${Date.now()}.${fileExtension}`;
    const blob = new Blob([base64ToBytes(cleanBase64)], { type: "image/png" });

    await supabase.storage.from("images").upload(originalPath, fileBytes, {
      contentType: mimeType,
      upsert: true,
    });

    const { data: originalUrlData } = supabase.storage.from("images")
      .getPublicUrl(originalPath);

    const originalUrl = originalUrlData.publicUrl;

    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY não configurada");
    }

    const ai = new GoogleGenAI({ apiKey });
    const image = await ai.files.upload({
      file: blob,
    });
    if (!image.uri || !image.mimeType) {
      throw new Error(
        "Failed to upload image to Google AI: missing uri or mimeType",
      );
    }
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        createUserContent([
          "Create only one short title description about this food photograph in portuguese",
          createPartFromUri(image.uri, image.mimeType),
        ]),
      ],
    });
    const imageDescription = response.text;

    const prompt =
      "Enhance this food photo while keeping all original elements, shapes, and positions. Improve sharpness, resolution, and lighting to make the dish look vivid, natural, and appetizing. Boost contrast and color vibrancy, remove cutlery, food imperfections, and distractions, without adding anything new. The final image should look realistic, high-quality, and professionally styled.";
    const form = new FormData();
    form.append("model", "gpt-image-1");
    form.append("prompt", prompt);
    form.append("size", "1024x1024");
    form.append("image", blob, "image.png");
    form.append("n", "1");

    const openaiRes = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
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
    const filePath = `${user.id}/generated/${Date.now()}.png`;

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

    const generatedUrl = fileUrlData.publicUrl;

    const { data: inserted, error: dbError } = await supabase
      .from("images")
      .insert([
        {
          user_id: user.id,
          image_url: originalUrl,
          variation_url: generatedUrl,
          description: imageDescription,
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
