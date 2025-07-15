import mongoose, { Schema, models } from "mongoose";

const announcementSchema = new Schema(
    {
        title: { type: String, required: true, trim: true, maxlength: 120 },
        body: { type: String, required: true, trim: true },
        expiresAt: { type: Date, required: true },
        authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

const Announcement =
    models.Announcement || mongoose.model("Announcement", announcementSchema);

export default Announcement;
