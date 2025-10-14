import mongoose, { Schema, Document, Types } from "mongoose";

const taskStatus = {
  PENDING: "pending",
  ON_HOLD: "onHold",
  IN_PROGRESS: "inProgress",
  UNDER_REVIEW: "underReview",
  COMPLETED: "completed"
} as const;

export type TaskStatus = (typeof taskStatus)[keyof typeof taskStatus];

export interface ITask extends Document {
  name: string;
  description: string;
  project: Types.ObjectId;
  status: TaskStatus;
  updatedBy: {
    user: Types.ObjectId;
    status: TaskStatus;
  }[];
  notes: Types.ObjectId[];
}

const taskSchema: Schema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true
    },
    description: {
      type: String,
      trim: true,
      required: true
    },
    project: {
      type: Types.ObjectId,
      ref: "Project"
    },
    status: {
      type: String,
      enum: Object.values(taskStatus),
      default: taskStatus.PENDING
    },
    updatedBy: [
      {
        user: {
          type: Types.ObjectId,
          ref: "User",
          default: null
        },
        status: {
          type: String,
          enum: Object.values(taskStatus),
          default: taskStatus.PENDING
        }
      }
    ],
    notes: [
      {
        type: Types.ObjectId,
        ref: "Note"
      }
    ]
  },
  { timestamps: true }
);

const Task = mongoose.model<ITask>("Task", taskSchema);
export default Task;
