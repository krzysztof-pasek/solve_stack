import { Schema, models, model, Types, Document } from "mongoose";

export interface IInteraction {
    user: Types.ObjectId;
    action: string;
    actionId: Types.ObjectId;
    actionType: string;
}

export const InteractionActionEnums = [
    "view",
    "upvote",
    "downvote",
    "bookmark",
    "post",
    "edit",
    "delete",
    "search",
] as const;

export interface IInteractionDoc extends IInteraction, Document {}
const InteractionSchema = new Schema<IInteraction>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        action: {
            type: String,
            enum: InteractionActionEnums,
            required: true,
        },
        actionId: { type: Schema.Types.ObjectId, required: true },
        actionType: {
            type: String,
            enum: ["question", "answer"],
            required: true,
        },
    },
    { timestamps: true }
);

const Interaction =
    models?.Interaction ||
    model<IInteraction>("Interaction", InteractionSchema);

export default Interaction;
