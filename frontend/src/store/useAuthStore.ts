import { axiosInstance } from '@/lib/axios';
import { AxiosError } from 'axios';
import { create } from 'zustand';

interface AuthStore {
	isAdmin: boolean;
	isLoading: boolean;
	error: AxiosError | null;

	checkAdminStatus: () => Promise<void>;
	reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
	isAdmin: false,
	isLoading: false,
	error: null,
	reset: () => set({ isAdmin: false, isLoading: false, error: null }),
	checkAdminStatus: async () => {
		set({ isLoading: true, error: null });
		try {
			const { data } = await axiosInstance.get('/admin/check');
			set({ isAdmin: data.admin });
		} catch (error: AxiosError | any) {
			set({ isAdmin: false, error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},
}));
