import mongoose from 'mongoose';

const schema = new mongoose.Schema(
	{
		userName: { type: String, required: [true, '發文者名稱必填'] },
		userPhoto: { type: String, required: [true, '發文者照片必填'] },
		liked: { type: Boolean, default: false },
		createdAt: {
			type: Date,
			default: Date.now(),
		},
	},
	{
		versionKey: false,
	}
);

export default mongoose.model('Post', schema);
