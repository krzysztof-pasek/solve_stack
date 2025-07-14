import { Schema, model, models, Document } from "mongoose";

export interface IMonthlyStat extends Document {
    month: Date;
    users: number;
    questions: number;
}

const schema = new Schema<IMonthlyStat>(
    {
        month: { type: Date, required: true, unique: true },
        users: { type: Number, required: true },
        questions: { type: Number, required: true },
    },
    { timestamps: true }
);

const MonthlyStat =
    models?.MonthlyStat || model<IMonthlyStat>("MonthlyStat", schema);

export default MonthlyStat;
