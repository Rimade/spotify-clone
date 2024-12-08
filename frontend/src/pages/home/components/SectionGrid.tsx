import SectionGridSkeleton from '@/components/skeletons/SectionGridSkeleton';
import { Button } from '@/components/ui/button';
import { Song } from '@/types';
import PlayButton from './PlayButton';

interface Props {
	title: string;
	songs: Song[];
	isLoading: boolean;
}

const SectionGrid: React.FC<Props> = ({ title, songs, isLoading }) => {
	if (isLoading) return <SectionGridSkeleton />;

	return (
		<div className="mb-8">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
				<Button variant="link" className="text-sm text-zinc-400 hover:text-white">
					Show All
				</Button>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{songs.map((song) => (
					<div
						className="bg-zinc-800/40 rounded-md p-4 hover:bg-zinc-700/40 transition-all group cursor-pointer"
						key={song._id}>
						<div className="relative mb-4">
							<div className="aspect-square rounded-md shadow-lg overflow-hidden">
								<img
									src={song.imageUrl}
									alt={song.title}
									className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
								/>
							</div>
							<PlayButton song={song} />
						</div>
						<h3 className="font-medium truncate mb-2">{song.title}</h3>
						<h3 className="text-sm text-zinc-400 truncate">{song.artist}</h3>
					</div>
				))}
			</div>
		</div>
	);
};

export default SectionGrid;
