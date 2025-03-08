import { createClient } from "@supabase/supabase-js";

const bucket = "main-bucket";

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string,
);

// Uploads an image to the storage bucket and returns the public URL
export const uploadImage = async (image: File) => {
  const timestamp = Date.now();
  // const newName = `/users/${timestamp}-${image.name}`;
  const newName = `${timestamp}-${image.name}`;

  const { data } = await supabase.storage.from(bucket).upload(newName, image, {
    cacheControl: "3600",
  });
  if (!data) throw new Error("Image upload failed");
  return supabase.storage.from(bucket).getPublicUrl(newName).data.publicUrl;
};

// Deletes an image from the storage bucket
export const deleteImage = (url: string) => {
  const imageName = url.split("/").pop();
  // console.log({ url, imageName });
  if (!imageName) throw new Error("Invalid image URL");
  return supabase.storage.from(bucket).remove([imageName]);
};
