type OpenAiImageResponse = {
  data?: Array<{
    b64_json?: string;
    url?: string;
  }>;
};

const provider = (process.env.AI_IMAGE_PROVIDER ?? "openai").toLowerCase();
const openaiKey = process.env.OPENAI_API_KEY ?? "";
const openaiModel = process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1";
const openaiSize = process.env.OPENAI_IMAGE_SIZE ?? "1024x1024";
const openaiQuality = process.env.OPENAI_IMAGE_QUALITY ?? "high";

const fetchJson = async (url: string, init: RequestInit) => {
  const response = await fetch(url, init);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `AI image request failed: ${response.status} ${response.statusText} ${errorText}`
    );
  }
  return response.json();
};

const fetchBinary = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Unable to fetch generated image: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const contentType = response.headers.get("content-type") || "image/png";
  return { buffer: Buffer.from(arrayBuffer), contentType };
};

export const aiImageService = {
  isConfigured() {
    if (provider === "openai") {
      return Boolean(openaiKey);
    }
    return false;
  },
  async generate(prompt: string) {
    if (provider !== "openai") {
      throw new Error(`AI image provider not supported: ${provider}`);
    }
    if (!openaiKey) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const payload = {
      model: openaiModel,
      prompt,
      size: openaiSize,
      quality: openaiQuality,
      n: 1,
      response_format: "b64_json",
    };

    const data = (await fetchJson("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify(payload),
    })) as OpenAiImageResponse;

    const image = data.data?.[0];
    if (!image) {
      throw new Error("AI image response missing data");
    }
    if (image.b64_json) {
      return {
        buffer: Buffer.from(image.b64_json, "base64"),
        contentType: "image/png",
      };
    }
    if (image.url) {
      return fetchBinary(image.url);
    }
    throw new Error("AI image response missing image payload");
  },
};
