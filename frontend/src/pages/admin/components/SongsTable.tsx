import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useMusicStore } from '@/store/useMusicStore';
import { Calendar, Trash2 } from 'lucide-react';

const SongsTable = () => {
	const { songs, isSongsLoading, error, deleteSong } = useMusicStore();

	const handleDelete = (id: string) => {
		if (window.confirm('Are you sure you want to delete this song?')) {
			deleteSong(id);
		}
	};

	if (isSongsLoading) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="text-zinc-400">Loading songs...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="text-red-400">{error}</div>
			</div>
		);
	}

	return (
		<Table>
			<TableHeader>
				<TableRow className="hover:bg-zinc-800/50">
					<TableHead className="w-[50px]"></TableHead>
					<TableHead>Title</TableHead>
					<TableHead>Artist</TableHead>
					<TableHead>Release Date</TableHead>
					<TableHead className="text-right">Actions</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
				{songs.map((song) => (
					<TableRow key={song._id} className="hover:bg-zinc-800/50">
						<TableCell>
							<img
								src={song.imageUrl}
								className="size-10 rounded object-cover"
								alt={song.title}
							/>
						</TableCell>
						<TableCell className="font-medium">{song.title}</TableCell>
						<TableCell>{song.artist}</TableCell>
						<TableCell>
							<span className="inline-flex items-center gap-1 text-zinc-400">
								<Calendar className="size-4" />
								{song.createdAt.split('T')[0]}
							</span>
						</TableCell>
						<TableCell className="text-right">
							<div className="flex justify-end gap-2">
								<Button
									variant={'ghost'}
									size={'sm'}
									onClick={() => handleDelete(song._id)}
									className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
									<Trash2 className="size-4" />
								</Button>
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default SongsTable;