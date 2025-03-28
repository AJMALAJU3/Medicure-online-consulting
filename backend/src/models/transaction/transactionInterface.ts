import mongoose from "mongoose";

export interface ITransaction extends Document {
    _id: string;
    transactionId: string;
    senderId: string;
    recieverId: string;
    amount: number;
    status: string;
    transactionDate: Date;
  }