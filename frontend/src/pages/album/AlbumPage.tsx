import { useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMusicStore } from '@/store/useMusicStore';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Clock, Pause, Play } from 'lucide-react';
import { usePlayerStore } from '@/store/usePlayerStore';
import { formatDuration } from '@/helpers';

const AlbumPage: React.FC = () => {
	const { id } = useParams();

	const { currentAlbum, fetchAlbumById, isAlbumLoading } = useMusicStore();
	const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

	useEffect(() => {
		id && fetchAlbumById(id);
	}, [fetchAlbumById, id]);

	if (isAlbumLoading) return null;

	const handlePlayAlbum = () => {
		if (!currentAlbum) return;

		const isCurrentAlbumPlaying = currentAlbum?.songs.some(
			(song) => song._id === currentSong?._id
		);

		if (isCurrentAlbumPlaying) togglePlay();
		else {
			// If the current album is not playing, play it from the beginning
			playAlbum(currentAlbum?.songs, 0);
		}
	};

	const handlePlaySong = (index: number) => {
		if (!currentAlbum) return;

		playAlbum(currentAlbum?.songs, index);
	};

	return (
		<div className="h-full">
			{/* Main Content */}
			<ScrollArea className="h-full rounded-md">
				{/* bg gradient */}
				<div
					className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80
					 to-zinc-900 pointer-events-none"
					aria-hidden="true"
				/>

				{/* Content */}
				<div className="relative z-10">
					<div className="flex p-6 gap-6 pb-8">
						<img
							src={currentAlbum?.imageUrl}
							alt={currentAlbum?.title}
							className="w-[240px] h-[240px] shadow-xl rounded"
						/>
						<div className="flex flex-col justify-end">
							<p className="text-sm font-medium">Album</p>
							<h1 className="text-7xl font-bold my-4">{currentAlbum?.title}</h1>
							<div className="flex items-center gap-2 text-sm text-zinc-100">
								<span className="font-medium text-white">{currentAlbum?.artist}</span>
								<span>• {currentAlbum?.songs.length} songs</span>
								<span>• {currentAlbum?.releaseYear}</span>
							</div>
						</div>
					</div>

					{/* play button */}
					<div className="px-6 pb-4 flex items-center gap-6">
						<Button
							onClick={handlePlayAlbum}
							size="icon"
							className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400
                hover:scale-105 transition-all">
							{isPlaying &&
							currentAlbum?.songs.some((song) => song._id === currentSong?._id) ? (
								<Pause className="text-black" />
							) : (
								<Play className="text-black" />
							)}
						</Button>
					</div>

					{/* Table Section */}
					<div className="bg-black/20 backdrop-blur-sm">
						{/* table header */}
						<div
							className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm
            text-zinc-400 border-b border-white/5">
							<div>#</div>
							<div>Title</div>
							<div>Released Date</div>
							<div>
								<Clock className="h-4 w-4" />
							</div>
						</div>

						{/* songs list */}

						<div className="px-6">
							<div className="space-y-2 py-4">
								{currentAlbum?.songs.map((song, index) => {
									const isCurrentSong = currentSong?._id === song._id;
									return (
										<div
											key={song._id}
											onClick={() => handlePlaySong(index)}
											className={`grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm
                text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer
                `}>
											<div className="flex items-center justify-center">
												{isCurrentSong && isPlaying ? (
													<div className="size-4 text-green-500">♫</div>
												) : (
													<span className="group-hover:hidden">{index + 1}</span>
												)}
												{!isCurrentSong && (
													<Play className="h-4 w-4 hidden group-hover:block" />
												)}
											</div>
											<div className="flex items-center gap-3">
												<img
													src={song.imageUrl}
													alt={song.title}
													className="size-10 rounded-md"
												/>
												<div>
													<div className="font-medium text-white">{song.title}</div>
													<div>{song.artist}</div>
												</div>
											</div>

											<div className="flex items-center">
												{song.createdAt.split('T')[0]}
											</div>
											<div className="flex items-center">
												{formatDuration(song.duration)}
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</ScrollArea>
		</div>
	);
};

export default AlbumPage;