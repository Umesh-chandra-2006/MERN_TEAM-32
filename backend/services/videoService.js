import ffmpeg from "fluent-ffmpeg";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";
import path from "path";
import os from "os";
import { Readable } from "stream";

// S3 Configuration
const s3Config = {
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
};

const s3Client = new S3Client(s3Config);
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "";
const CLOUDFRONT_DOMAIN = process.env.AWS_CLOUDFRONT_DOMAIN || "";

/**
 * Generates a presigned URL for direct S3 upload from the browser.
 */
export const generatePresignedUploadUrl = async (s3Key) => {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
    // ContentType: "video/*" // Optional: restrict to videos
  });
  
  // URL expires in 15 minutes
  return await getSignedUrl(s3Client, command, { expiresIn: 900 });
};

/**
 * Transcodes a raw video (from S3) to HLS and uploads segments back to S3.
 * inputS3Key: The location of the raw video in S3.
 */
export const processS3VideoToHLS = async (inputS3Key, s3KeyPrefix) => {
  const tempId = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const outputDir = path.join(os.tmpdir(), "gemini-video-transcode", tempId);
  const rawLocalPath = path.join(outputDir, "raw_video.tmp");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // 1. Download raw file from S3 to local temp
    console.log(`Downloading raw video from S3: ${inputS3Key}`);
    const getObjectParams = { Bucket: BUCKET_NAME, Key: inputS3Key };
    const { Body } = await s3Client.send(new GetObjectCommand(getObjectParams));
    
    // Convert stream to file
    const fileStream = fs.createWriteStream(rawLocalPath);
    await new Promise((resolve, reject) => {
      Body.pipe(fileStream)
        .on("error", reject)
        .on("finish", resolve);
    });

    // 2. Transcode
    const hlsPlaylistFile = "playlist.m3u8";
    const hlsPlaylistPath = path.join(outputDir, hlsPlaylistFile);

    await new Promise((resolve, reject) => {
      ffmpeg(rawLocalPath)
        .outputOptions([
          "-profile:v baseline",
          "-level 3.0",
          "-start_number 0",
          "-hls_time 10",
          "-hls_list_size 0",
          "-f hls",
        ])
        .output(hlsPlaylistPath)
        .on("end", async () => {
          console.log("Transcoding finished. Uploading to S3...");
          try {
            const files = fs.readdirSync(outputDir).filter(f => f !== "raw_video.tmp");
            const uploadPromises = files.map(async (file) => {
              const filePath = path.join(outputDir, file);
              const fileBuffer = fs.readFileSync(filePath);
              const uploadParams = {
                Bucket: BUCKET_NAME,
                Key: `${s3KeyPrefix}/${file}`,
                Body: fileBuffer,
                ContentType: file.endsWith(".m3u8") ? "application/x-mpegURL" : "video/MP2T",
              };
              return s3Client.send(new PutObjectCommand(uploadParams));
            });

            await Promise.all(uploadPromises);

            const hlsUrl = CLOUDFRONT_DOMAIN 
              ? `https://${CLOUDFRONT_DOMAIN}/${s3KeyPrefix}/${hlsPlaylistFile}`
              : `https://${BUCKET_NAME}.s3.${s3Config.region}.amazonaws.com/${s3KeyPrefix}/${hlsPlaylistFile}`;
            
            resolve(hlsUrl);
          } catch (err) {
            reject(err);
          }
        })
        .on("error", reject)
        .run();
    });

    // 3. Optional: Delete the raw file from S3 after processing
    // await s3Client.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: inputS3Key }));

    return { 
      hlsUrl: CLOUDFRONT_DOMAIN 
        ? `https://${CLOUDFRONT_DOMAIN}/${s3KeyPrefix}/${hlsPlaylistFile}`
        : `https://${BUCKET_NAME}.s3.${s3Config.region}.amazonaws.com/${s3KeyPrefix}/${hlsPlaylistFile}`
    };

  } finally {
    // 4. Final Cleanup
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true });
    }
  }
};
