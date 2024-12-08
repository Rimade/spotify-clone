import { axiosInstance } from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { useChatStore } from '@/store/useChatStore';
import { useAuth } from '@clerk/clerk-react';
import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';

const updateApiToken = (token: string | null) => {
	if (token) axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	else delete axiosInstance.defaults.headers.common['Authorization'];
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { getToken, userId } = useAuth();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const { checkAdminStatus } = useAuthStore();
	const { initializeSocket, disconnectSocket } = useChatStore();

	useEffect(() => {
		const initToken = async () => {
			try {
				const token = await getToken();
				updateApiToken(token);
				if (token) {
					await checkAdminStatus();
					// init socket
					userId && initializeSocket(userId);
				}
			} catch (error) {
				updateApiToken(null);
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		};

		initToken();

		// cleanup
		return () => {
			disconnectSocket();
		};
	}, [getToken, userId, initializeSocket, disconnectSocket, checkAdminStatus]);

	if (isLoading)
		return (
			<div className="h-screen w-full flex items-center justify-center">
				<Loader className="size-8 text-emerald-500 animate-spin" />
			</div>
		);

	return <>{children}</>;
};

export default AuthProvider;
