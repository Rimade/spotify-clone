import { Server } from 'socket.io';
import Message from '../models/message.model.js';

export const initializeSocket = async (server) => {
	// Инициализация сокета
	const io = new Server(server, {
		cors: {
			origin: process.env.FRONTEND_URL,
			credentials: true,
		},
	});

	const userSockets = new Map(); // userId -> socketId
	const userActivities = new Map(); // userId -> activity

	io.on('connection', (socket) => {
		socket.on('user_connected', (userId) => {
			userSockets.set(userId, socket.id); // Сохраняем сокет ID для пользователя
			userActivities.set(userId, 'Idle'); // Устанавливаем статус активности пользователя

			io.emit('user_connected', userId); // Уведомляем всех клиентов о новом подключении

			socket.emit('users_online', Array.from(userSockets.keys())); // Отправляем подключенному пользователю список всех онлайн-пользователей

			io.emit('activities', Array.from(userActivities.entries())); // Рассылаем всем список активностей пользователей
		});

		socket.on('update_activity', ({ userId, activity }) => {
			userActivities.set(userId, activity);
			io.emit('activity_changed', { userId, activity });
		});

		socket.on('send_message', async (data) => {
			try {
				const { receiverId, senderId, content } = data;

				const message = await Message.create({
					senderId,
					receiverId,
					content,
				});

				// send to receiver in real time, if they're online
				const receiverSocketId = userSockets.get(receiverId);

				if (receiverSocketId) {
					io.to(receiverSocketId).emit('receive_message', message);
				}

				socket.emit('message_sent', message);
			} catch (error) {
				console.error('Error sending message:', error);
				socket.emit('message_error', error.message);
			}
		});

		socket.on('disconnect', () => {
			let disconnectedUserId;
			for (const [userId, socketId] of userSockets.entries()) {
				if (socketId === socket.id) {
					disconnectedUserId = userId;
					userSockets.delete(userId);
					userActivities.delete(userId);
					break;
				}
			}

			if (disconnectedUserId) {
				io.emit('user_disconnected', disconnectedUserId);
			}
		});
	});
};
