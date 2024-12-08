import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
	{
		senderId: { type: String, required: true }, // Ссылка на отправителя
		receiverId: { type: String, required: true }, // Ссылка на получателя
		content: { type: String, required: true }, // Текст сообщения
	},
	{ timestamps: true }
);

export default mongoose.model('Message', messageSchema);
