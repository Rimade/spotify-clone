import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@/components/ui/resizable';
import LeftSidebar from './components/LeftSidebar';
import FriendsActivity from './components/FriendsActivity';
import AudioPlayer from './components/AudioPlayer';
import PlaybackControls from './components/PlaybackControls';
const MainLayout = () => {
	const [isMobile, setIsMobile] = useState<boolean>(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();

		window.addEventListener('resize', checkMobile);

		return () => {
			window.removeEventListener('resize', checkMobile);
		};
	}, []);

	return (
		<div className="h-screen bg-black text-white flex flex-col">
			<ResizablePanelGroup
				direction="horizontal"
				className="flex-1 flex h-full overflow-hidden p-2">
				<AudioPlayer />
				{/* Left sidebar */}
				<ResizablePanel defaultSize={20} minSize={isMobile ? 0 : 10} maxSize={30}>
					<LeftSidebar />
				</ResizablePanel>
				{/* Main content */}

				<ResizableHandle
					className="w-2 bg-black rounded-lg transition-colors"
					tabIndex={-1}
				/>
				<ResizablePanel defaultSize={isMobile ? 80 : 60}>
					<Outlet />
				</ResizablePanel>

				{!isMobile && (
					<>
						<ResizableHandle
							tabIndex={-2}
							className="w-2 bg-black rounded-lg transition-colors"
						/>
						{/* Right sidebar */}
						<ResizablePanel defaultSize={20} minSize={0} maxSize={25} collapsedSize={0}>
							<FriendsActivity />
						</ResizablePanel>
					</>
				)}
			</ResizablePanelGroup>

			<PlaybackControls />
		</div>
	);
};

export default MainLayout;
