import { z } from "zod";

// Define a schema for the task, including only rollingno and fullname


const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const fileSchema = z
  .instanceof(File)
  .refine(
    (file) => ALLOWED_FILE_TYPES.includes(file.type),
    "Only JPEG, PNG, and WebP files are allowed."
  );
export const taskSchema = z.object({
  rollingno: z.string(),
  FullName: z.string(),
  Address: z.string(),
  Mobno:z. number(),
  EMobno: z.number(),
  Age:z.number(),
  Aadhaar:z.number(),
  Gender: z.string(),
  BloodGrp: z.string(),
  disease: z.string(),
  items: z.array(z.string()),
  type: z.enum(["Reader", "Reader and Volunteer", "Volunteer"]),
  profileImage: fileSchema,
  aadhaarImage: fileSchema,
});

export type Task = z.infer<typeof taskSchema>;
