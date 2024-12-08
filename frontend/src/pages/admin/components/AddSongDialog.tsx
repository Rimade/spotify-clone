import { useRef, useState } from 'react';
// import { useForm, SubmitHandler } from "react-hook-form"
import { Button } from '@/components/ui/button';
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { useMusicStore } from '@/store/useMusicStore';
import { Dialog } from '@radix-ui/react-dialog';
import { Plus, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import toast from 'react-hot-toast';
import { axiosInstance } from '@/lib/axios';

interface NewSong {
	title: string;
	artist: string;
	album: string;
	duration: string;
}

const AddSongDialog = () => {
	const { albums } = useMusicStore();
	const [songDialogOpen, setSongDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [newSong, setNewSong] = useState<NewSong>({
		title: '',
		artist: '',
		album: '',
		duration: '0',
	});

	const [files, setFiles] = useState<{ audioFile: File | null; imageFile: File | null }>({
		audioFile: null,
		imageFile: null,
	});

	const audioInputRef = useRef<HTMLInputElement>(null);
	const imageInputRef = useRef<HTMLInputElement>(null);

	const handleSubmit = async () => {
		setIsLoading(true);

		try {
			if (!files.audioFile || !files.imageFile) {
				return toast.error('Please upload both audio and image files');
			}

			const formData = new FormData();

			formData.append('title', newSong.title);
			formData.append('artist', newSong.artist);
			formData.append('duration', newSong.duration);
			if (newSong.album && newSong.album !== 'none') {
				formData.append('albumId', newSong.album);
			}

			formData.append('audioFile', files.audioFile);
			formData.append('imageFile', files.imageFile);

			await axiosInstance.post('/admin/songs', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			setNewSong({
				title: '',
				artist: '',
				album: '',
				duration: '0',
			});

			setFiles({
				audioFile: null,
				imageFile: null,
			});
			toast.success('Song added successfully');
		} catch (error: any) {
			toast.error('Failed to add song: ' + error.message);
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<Dialog open={songDialogOpen} onOpenChange={setSongDialogOpen}>
			<DialogTrigger asChild>
				<Button className="bg-emerald-500 hover:bg-emerald-600 text-black">
					<Plus className="size-4 mr-2" />
					Add Song
				</Button>
			</DialogTrigger>
			<DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto">
				<DialogHeader>
					<DialogTitle>Add New Song</DialogTitle>
					<DialogDescription>Add a new song to your library</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<input
						type="file"
						accept="audio/*"
						hidden
						ref={audioInputRef}
						onChange={(e) =>
							setFiles((prev) => ({ ...prev, audioFile: e.target.files![0] }))
						}
					/>

					<input
						type="file"
						accept="image/*"
						className="hidden"
						ref={imageInputRef}
						onChange={(e) =>
							setFiles((prev) => ({ ...prev, imageFile: e.target.files![0] }))
						}
					/>

					{/* image upload area */}
					<div
						className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer"
						onClick={() => imageInputRef.current?.click()}>
						<div className="text-center">
							{files.imageFile ? (
								<div className="space-y-2">
									<div className="text-sm text-emerald-500">Image selected:</div>
									<div className="text-xs text-zinc-400">
										{files.imageFile.name.slice(0, 20)}
									</div>
								</div>
							) : (
								<>
									<div className="p-3 bg-zinc-800 rounded-full inline-block mb-2">
										<Upload className="h-6 w-6 text-zinc-400" />
									</div>
									<div className="text-sm text-zinc-400 mb-2">Upload artwork</div>
									<Button variant="outline" size="sm" className="text-xs">
										Choose File
									</Button>
								</>
							)}
						</div>
					</div>

					{/* audio upload area */}
					<div className="space-y-2">
						<label className="text-sm font-medium">Audio File</label>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								className="w-full"
								onClick={() => audioInputRef.current?.click()}>
								{files.audioFile
									? files.audioFile.name.slice(0, 20)
									: 'Choose Audio File'}
							</Button>
						</div>
					</div>

					{/* other fields */}
					<div className="space-y-2">
						<label className="text-sm font-medium">Title</label>
						<Input
							value={newSong.title}
							onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
							className="bg-zinc-800 border-zinc-700"
						/>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium">Artist</label>
						<Input
							value={newSong.artist}
							onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
							className="bg-zinc-800 border-zinc-700"
						/>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium">Duration (seconds)</label>
						<Input
							type="number"
							min="0"
							value={newSong.duration}
							onChange={(e) =>
								setNewSong({ ...newSong, duration: e.target.value || '0' })
							}
							className="bg-zinc-800 border-zinc-700"
						/>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium">Album (Optional)</label>
						<Select
							value={newSong.album}
							onValueChange={(value) => setNewSong({ ...newSong, album: value })}>
							<SelectTrigger className="bg-zinc-800 border-zinc-700">
								<SelectValue placeholder="Select album" />
							</SelectTrigger>
							<SelectContent className="bg-zinc-800 border-zinc-700">
								<SelectItem value="none">No Album (Single)</SelectItem>
								{albums.map((album) => (
									<SelectItem key={album._id} value={album._id}>
										{album.title}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => setSongDialogOpen(false)}
						disabled={isLoading}>
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={isLoading}>
						{isLoading ? 'Uploading...' : 'Add Song'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default AddSongDialog;
