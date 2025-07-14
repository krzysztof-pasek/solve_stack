import { Schema, model, models, Document, Types } from "mongoose";

export interface IReport {
    post: Types.ObjectId;
    reporter: Types.ObjectId;
    reason: string;
    status: "open" | "resolved";
}

export interface IReportDoc extends IReport, Document {}

const ReportSchema = new Schema<IReport>(
    {
        post: { type: Schema.Types.ObjectId, ref: "Question", required: true },
        reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
        reason: { type: String, required: true },
        status: { type: String, enum: ["open", "resolved"], default: "open" },
    },
    { timestamps: true }
);

const Report = models?.Report || model<IReport>("Report", ReportSchema);
export default Report;
