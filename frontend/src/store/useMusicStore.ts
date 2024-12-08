import { axiosInstance } from '@/lib/axios';
import { Album, Song, Stats } from '@/types';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { create } from 'zustand';

type MusicStore = {
	albums: Album[];
	stats: Stats;
	songs: Song[];
	currentAlbum: Album | null;
	isLoading: boolean;
	isAlbumLoading: boolean;
	error: string | null;
	featuredSongs: Song[];
	madeForYouSongs: Song[];
	trendingSongs: Song[];

	isSongsLoading: boolean;
	isStatsLoading: boolean;

	fetchAlbums: () => Promise<void>;
	fetchAlbumById: (id: string) => Promise<void>;
	fetchFeaturedSongs: () => Promise<void>;
	fetchMadeForYouSongs: () => Promise<void>;
	fetchTrendingSongs: () => Promise<void>;
	fetchSongs: () => Promise<void>;
	fetchStats: () => Promise<void>;
	deleteSong: (id: string) => Promise<void>;
	deleteAlbum: (id: string) => Promise<void>;
};

export const useMusicStore = create<MusicStore>((set) => ({
	albums: [],
	songs: [],
	currentAlbum: null,
	stats: {
		totalSongs: 0,
		totalUsers: 0,
		totalAlbums: 0,
		totalArtists: 0,
	},
	isLoading: false,
	isAlbumLoading: false,
	error: null,
	featuredSongs: [],
	madeForYouSongs: [],
	trendingSongs: [],

	isSongsLoading: false,
	isStatsLoading: false,

	deleteAlbum: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/admin/albums/${id}`);

			set((state) => ({
				albums: state.albums.filter((album) => album._id !== id),
				songs: state.songs.map((song) =>
					song.albumId === state.albums.find((album) => album._id === id)?.title
						? { ...song, albumId: null }
						: song
				),
			}));
			toast.success('Song deleted successfully');
		} catch (error: AxiosError | any) {
			toast.error('Error deleting song' + error.message);
		} finally {
			set({ isLoading: false });
		}
	},

	deleteSong: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/admin/songs/${id}`);

			set((state) => ({
				songs: state.songs.filter((song) => song._id !== id),
			}));

			toast.success('Song deleted successfully');
		} catch (error: AxiosError | any) {
			toast.error('Error deleting song' + error.message);
		} finally {
			set({ isLoading: false });
		}
	},

	fetchSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const { data } = await axiosInstance.get('/songs');
			set({ songs: data });
		} catch (error: AxiosError | any) {
			set({ error: error.message });
		} finally {
			set({ isSongsLoading: false });
		}
	},

	fetchStats: async () => {
		set({ isLoading: true, error: null });
		try {
			const { data } = await axiosInstance.get('/stats');
			set({ stats: data });
		} catch (error: AxiosError | any) {
			set({ error: error.message });
		} finally {
			set({ isStatsLoading: false });
		}
	},

	fetchAlbums: async () => {
		set({ isLoading: true, error: null });
		try {
			const { data } = await axiosInstance.get('/albums');
			set({ albums: data });
		} catch (error: AxiosError | any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchAlbumById: async (id) => {
		set({ isAlbumLoading: true, error: null });
		try {
			const { data } = await axiosInstance.get(`/albums/${id}`);
			set({ currentAlbum: data });
		} catch (error: AxiosError | any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isAlbumLoading: false });
		}
	},

	fetchFeaturedSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const { data } = await axiosInstance.get('/songs/featured');
			set({ featuredSongs: data });
		} catch (error: AxiosError | any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchMadeForYouSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const { data } = await axiosInstance.get('/songs/made-for-you');
			set({ madeForYouSongs: data });
		} catch (error: AxiosError | any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchTrendingSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const { data } = await axiosInstance.get('/songs/trending');
			set({ trendingSongs: data });
		} catch (error: AxiosError | any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},
}));
