import { processS3VideoToHLS } from "./videoService.js";
import { CourseTypeModel } from "../models/CourseModel.js";

/**
 * A simple in-memory task queue for sequential video processing.
 * This prevents multiple FFmpeg instances from overwhelming the CPU.
 */
class SimpleVideoQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  /**
   * Add a new video processing task to the queue
   */
  async add(task) {
    console.log(`[Queue] Task added for lecture: ${task.lectureId}`);
    this.queue.push(task);
    if (!this.isProcessing) {
      this.processNext();
    }
  }

  async processNext() {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      console.log("[Queue] All tasks completed.");
      return;
    }

    this.isProcessing = true;
    const task = this.queue.shift();
    const { s3Key, s3KeyPrefix, courseId, lectureId, instructorId } = task;

    try {
      console.log(`[Queue] Processing lecture: ${lectureId}`);
      
      const { hlsUrl } = await processS3VideoToHLS(s3Key, s3KeyPrefix);

      await CourseTypeModel.findOneAndUpdate(
        { _id: courseId, "lectures._id": lectureId, instructor: instructorId },
        { 
          $set: { 
            "lectures.$.videoUrl": hlsUrl,
            "lectures.$.processingStatus": "completed" 
          } 
        }
      );
      console.log(`[Queue] Success: ${lectureId}`);
    } catch (err) {
      console.error(`[Queue] Failed: ${lectureId}`, err);
      await CourseTypeModel.findOneAndUpdate(
        { _id: courseId, "lectures._id": lectureId, instructor: instructorId },
        { $set: { "lectures.$.processingStatus": "failed" } }
      );
    }

    // Process next task
    this.processNext();
  }
}

export const videoQueue = new SimpleVideoQueue();
