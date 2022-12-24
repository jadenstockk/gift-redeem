import { model, models, Schema } from "mongoose"

const GiftSchema = new Schema(
	{
		name: String,
		code: {
			type: String,
			unique: true,
			required: true
		},
		redeemsLeft: {
			type: Number,
			default: 1
		},
		type: {
			type: String,
			enum: ["qrhunt", "directions", "message", "card", "image", "file"],
			required: true
		},
		recipient: {
			nickName: {
				type: String
			},
			fullName: {
				type: String
			}
		},
		event: {
			type: String,
			enum: ["birthday", "christmas", "newyear"]
		}
	},
	{ timestamps: true }
)

export default models.gifts || model("gifts", GiftSchema)
