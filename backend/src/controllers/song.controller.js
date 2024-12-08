import Song from '../models/song.model.js';

export const getAllSongs = async (req, res, next) => {
	try {
		const songs = await Song.find().sort({ createdAt: -1 }); // -1 = Descending => newest -> oldest
		res.status(200).json(songs);
	} catch (error) {
		next(error);
	}
};

export const getSongById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const song = await Song.findById(id);
		if (!song) {
			return res.status(404).json({ message: 'Song not found' });
		}
		res.status(200).json(song);
	} catch (error) {
		next(error);
	}
};

export const getFeaturedSongs = async (req, res, next) => {
	try {
		const songs = await Song.aggregate([
			{ $sample: { size: 6 } },
			{ $project: { _id: 1, title: 1, artist: 1, imageUrl: 1, audioUrl: 1 } },
		]);
		res.json(songs);
	} catch (error) {
		next(error);
	}
};

export const getMadeForYouSongs = async (req, res, next) => {
	try {
		const songs = await Song.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);

		res.json(songs);
	} catch (error) {
		next(error);
	}
};
export const getTrendingSongs = async (req, res, next) => {
	try {
		const songs = await Song.aggregate([
			{ $sample: { size: 4 } },
			{ $project: { _id: 1, title: 1, artist: 1, imageUrl: 1, audioUrl: 1 } },
		]);
		res.json(songs);
	} catch (error) {
		next(error);
	}
};
