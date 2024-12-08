import { useEffect } from 'react';
import TopBar from '@/components/TopBar';
import { useMusicStore } from '@/store/useMusicStore';
import FeaturedSection from './components/FeaturedSection';
import { ScrollArea } from '@/components/ui/scroll-area';
import SectionGrid from './components/SectionGrid';
import { usePlayerStore } from '@/store/usePlayerStore';

const HomePage: React.FC = () => {
	const {
		fetchMadeForYouSongs,
		fetchFeaturedSongs,
		fetchTrendingSongs,
		isLoading,
		featuredSongs,
		madeForYouSongs,
		trendingSongs,
	} = useMusicStore();

	const { initQueue } = usePlayerStore();

	useEffect(() => {
		fetchFeaturedSongs();
		fetchMadeForYouSongs();
		fetchTrendingSongs();
	}, [fetchMadeForYouSongs, fetchFeaturedSongs, fetchTrendingSongs]);

	useEffect(() => {
		if (
			madeForYouSongs.length > 0 &&
			featuredSongs.length > 0 &&
			trendingSongs.length > 0
		) {
			const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
			initQueue(allSongs);
		}
	}, [madeForYouSongs, featuredSongs, trendingSongs, initQueue]);

	return (
		<main className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
			<TopBar />
			<ScrollArea className="h-[calc(100vh-180px)]">
				<div className="p-4 sm:p-6">
					<h1 className="text-2xl sm:text-3xl font-bold mb-6">Good Afternoon</h1>
					<FeaturedSection />

					<div className="space-y-8">
						<SectionGrid
							isLoading={isLoading}
							title="Made For You"
							songs={madeForYouSongs}
						/>
						<SectionGrid isLoading={isLoading} title="Trending" songs={trendingSongs} />
					</div>
				</div>
			</ScrollArea>
		</main>
	);
};

export default HomePage;
