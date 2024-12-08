import { usePlayerStore } from '@/store/usePlayerStore';
import { useEffect, useRef } from 'react';

const AudioPlayer = () => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const prevSongRef = useRef<string | null>(null);

	const { currentSong, isPlaying, playNext } = usePlayerStore();

	// handle play
	useEffect(() => {
		if (isPlaying) {
			audioRef.current?.play();
		} else {
			audioRef.current?.pause();
		}
	}, [currentSong, isPlaying]);

	// handle audio ended
	useEffect(() => {
		const audio = audioRef.current;

		const handleEnded = () => {
			playNext();
		};

		audio?.addEventListener('ended', handleEnded);

		return () => {
			audio?.removeEventListener('ended', handleEnded);
		};
	}, [playNext]);

	// handle song change
	useEffect(() => {
		if (!audioRef.current || !currentSong) return;
		const audio = audioRef.current;

		const isSongChange = prevSongRef.current !== currentSong?.audioUrl;

		if (isSongChange) {
			audio.src = currentSong?.audioUrl;

			audio.currentTime = 0;

			prevSongRef.current = currentSong?.audioUrl;
			if (isPlaying) audio.play();
		}
	}, [currentSong, isPlaying]);

	return <audio ref={audioRef} />;
};

export default AudioPlayer;
