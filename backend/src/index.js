import express from 'express';
import { config } from 'dotenv';
import { clerkMiddleware } from '@clerk/express';
import { connectDB } from './lib/db.js';
import { createServer } from 'http';
import cron from 'node-cron';
import fileUpload from 'express-fileupload';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import {
	userRoutes,
	authRoutes,
	adminRoutes,
	songRoutes,
	albumRoutes,
	statsRoutes,
} from './routes/index.js';
import { initializeSocket } from './lib/socket.js';
import { readdir } from 'fs';
config();

const __dirname = path.resolve();

const app = express();
const port = process.env.PORT || 5000;
const httpServer = createServer(app);

initializeSocket(httpServer);

app.use(express.json());
app.use(clerkMiddleware());
app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	})
);
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: path.join(__dirname, 'tmp'),
		createParentPath: true,
		limits: {
			fileSize: 30 * 1024 * 1024, // 50MB
		},
	})
);

const tempdir = path.join(process.cwd(), 'tmp');
cron.schedule('0 * * * *', () => {
	if (fs.existsSync(tempdir)) {
		fs.readdir(tempdir, (err, files) => {
			if (err) {
				console.log(err);
				return;
			}
			for (const file of files) {
				fs.unlink(path.join(tempdir, file), (err) => {});
			}
		});
	}
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/stats', statsRoutes);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../frontend/dist')));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
	});
}

// error handler
app.use((err, req, res, next) => {
	if (err) {
		console.log(err);
		return res.status(500).json({
			message:
				process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
		});
	}
	next();
});

httpServer.listen(port, () => {
	connectDB();
	console.log(`Server running on port ${port}`);
});
