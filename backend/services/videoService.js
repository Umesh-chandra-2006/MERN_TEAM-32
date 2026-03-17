import ffmpeg from "fluent-ffmpeg";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

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

/**
 * Checks if AWS credentials and bucket are configured.
 */
const isAWSConfigured = () => {
  return (
    s3Config.credentials.accessKeyId &&
    s3Config.credentials.secretAccessKey &&
    BUCKET_NAME
  );
};

/**
 * Checks if ffmpeg is available on the system.
 */
const checkFFmpeg = () => {
  return new Promise((resolve) => {
    ffmpeg.getAvailableCodecs((err) => {
      if (err) {
        console.warn("FFmpeg not found. Video transcoding will be skipped (Mock Mode).");
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

/**
 * Transcodes a raw video to HLS (.m3u8 + .ts segments)
 * and uploads them to S3.
 */
export const processVideoToHLS = async (inputPath, outputDir, s3KeyPrefix) => {
  const hasFFmpeg = await checkFFmpeg();
  const hasAWS = isAWSConfigured();

  // Ensure the local output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const hlsPlaylistFile = "playlist.m3u8";
  const hlsPlaylistPath = path.join(outputDir, hlsPlaylistFile);

  // MOCK MODE: If FFmpeg or AWS is missing, simulate the process for testing
  if (!hasFFmpeg || !hasAWS) {
    console.log("Running in MOCK MODE for video processing.");
    
    // Simulate some work
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!hasAWS) {
      // If no AWS, we'll just return a local path (simulated as a URL)
      // Note: In a real app, you'd serve these files via express.static
      return `/uploads/hls/${s3KeyPrefix}/${hlsPlaylistFile}`;
    }
    
    // If we have AWS but no FFmpeg, we can't really upload HLS segments
    // but we could upload the raw file as a fallback if desired.
    // For now, let's just throw an error if FFmpeg is missing but we're expected to upload to S3.
    if (!hasFFmpeg && hasAWS) {
      throw new Error("FFmpeg is required for HLS transcoding but was not found.");
    }
  }

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
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
          const files = fs.readdirSync(outputDir);
          const uploadPromises = files.map(async (file) => {
            const filePath = path.join(outputDir, file);
            const fileBuffer = fs.readFileSync(filePath); // Use buffer instead of stream
            const uploadParams = {
              Bucket: BUCKET_NAME,
              Key: `${s3KeyPrefix}/${file}`,
              Body: fileBuffer,
              ContentLength: fileBuffer.length, // Explicitly provide length
              ContentType: file.endsWith(".m3u8") ? "application/x-mpegURL" : "video/MP2T",
            };
            return s3Client.send(new PutObjectCommand(uploadParams));
          });

          await Promise.all(uploadPromises);

          // Return the URL of the .m3u8 file
          const hlsUrl = `https://${BUCKET_NAME}.s3.${s3Config.region}.amazonaws.com/${s3KeyPrefix}/${hlsPlaylistFile}`;
          resolve(hlsUrl);
        } catch (err) {
          console.error("S3 Upload Error:", err);
          reject(new Error(`Failed to upload to S3: ${err.message}`));
        }
      })
      .on("error", (err) => {
        console.error("Transcoding error: ", err);
        reject(new Error(`Transcoding failed: ${err.message}`));
      })
      .run();
  });
};
