import mongoose, { Schema } from "mongoose";
import { IAppointment } from "./appointmentInterface";
import { v4 as uuidv4 } from 'uuid';
export const appointmentSchema = new Schema<IAppointment>({
  doctorId: {
    type: String,
    required: true,
  },
  patientId: {
    type: String,
    required: true,
  },
  slotId: {
    type: String,
    required: true,
  },
  roomId: {
    type: String,
    default: () => uuidv4()
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  recordId: {
    type: Schema.Types.ObjectId,
    ref: "MedicalRecord",
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});
