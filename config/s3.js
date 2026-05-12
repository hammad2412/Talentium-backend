import { S3Client } from "@aws-sdk/client-s3";

if (!process.env.AWS_ACCESS_KEY) {
  throw new Error("AWS_ACCESS_KEY is missing");
}

if (!process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error("AWS_SECRET_ACCESS_KEY is missing");
}

if (!process.env.AWS_REGION) {
  throw new Error("AWS_REGION is missing");
}

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY.trim(),
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY.trim(),
  },
});

console.log("AWS_ACCESS_KEY loaded:", !!process.env.AWS_ACCESS_KEY);
console.log(
  "AWS_SECRET_ACCESS_KEY loaded:",
  !!process.env.AWS_SECRET_ACCESS_KEY,
);
console.log("AWS_REGION:", process.env.AWS_REGION);

export default s3;
