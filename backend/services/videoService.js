import ffmpeg from "fluent-ffmpeg";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";
import path from "path";
import os from "os";
import { pipeline } from "stream/promises";

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
  if (!BUCKET_NAME) throw new Error("AWS_S3_BUCKET_NAME is not configured");
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
  });
  
  // URL expires in 15 minutes
  return await getSignedUrl(s3Client, command, { expiresIn: 900 });
};

/**
 * Transcodes a raw video (from S3) to HLS and uploads segments back to S3.
 */
export const processS3VideoToHLS = async (inputS3Key, s3KeyPrefix) => {
  if (!BUCKET_NAME) throw new Error("AWS_S3_BUCKET_NAME is not configured");

  const tempId = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const outputDir = path.join(os.tmpdir(), "gemini-video-transcode", tempId);
  const rawLocalPath = path.join(outputDir, "raw_video.tmp");

  console.log(`[VideoService] Starting process for ${inputS3Key}`);
  console.log(`[VideoService] Temp directory: ${outputDir}`);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // 1. Download raw file from S3 to local temp
    console.log(`[VideoService] Downloading from S3: ${inputS3Key}`);
    const { Body } = await s3Client.send(new GetObjectCommand({ 
      Bucket: BUCKET_NAME, 
      Key: inputS3Key 
    }));
    
    await pipeline(Body, fs.createWriteStream(rawLocalPath));
    console.log(`[VideoService] Download complete.`);

    // 2. Transcode
    const hlsPlaylistFile = "playlist.m3u8";
    const hlsPlaylistPath = path.join(outputDir, hlsPlaylistFile);

    console.log(`[VideoService] Starting FFmpeg transcoding...`);
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
        .on("start", (commandLine) => {
          console.log(`[VideoService] FFmpeg command: ${commandLine}`);
        })
        .on("end", () => {
          console.log("[VideoService] Transcoding finished.");
          resolve();
        })
        .on("error", (err) => {
          console.error(`[VideoService] FFmpeg error: ${err.message}`);
          reject(err);
        })
        .run();
    });

    // 3. Upload segments back to S3
    console.log(`[VideoService] Uploading HLS segments to S3...`);
    const files = fs.readdirSync(outputDir).filter(f => f !== "raw_video.tmp");
    const uploadPromises = files.map(async (file) => {
      const filePath = path.join(outputDir, file);
      const fileBuffer = fs.readFileSync(filePath);
      return s3Client.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `${s3KeyPrefix}/${file}`,
        Body: fileBuffer,
        ContentType: file.endsWith(".m3u8") ? "application/x-mpegURL" : "video/MP2T",
      }));
    });

    await Promise.all(uploadPromises);
    console.log(`[VideoService] All segments uploaded.`);

    const hlsUrl = CLOUDFRONT_DOMAIN 
      ? `https://${CLOUDFRONT_DOMAIN}/${s3KeyPrefix}/${hlsPlaylistFile}`
      : `https://${BUCKET_NAME}.s3.${s3Config.region}.amazonaws.com/${s3KeyPrefix}/${hlsPlaylistFile}`;
    
    return { hlsUrl };

  } catch (err) {
    console.error(`[VideoService] Critical failure: ${err.message}`);
    throw err;
  } finally {
    // 4. Cleanup
    if (fs.existsSync(outputDir)) {
      try {
        fs.rmSync(outputDir, { recursive: true, force: true });
        console.log(`[VideoService] Cleanup complete.`);
      } catch (cleanupErr) {
        console.error(`[VideoService] Cleanup failed: ${cleanupErr.message}`);
      }
    }
  }
};
