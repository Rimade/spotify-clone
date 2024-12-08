import { useEffect } from 'react';
import TopBar from '@/components/TopBar';
import { useChatStore } from '@/store/useChatStore';
import { useUser } from '@clerk/clerk-react';
import UsersList from './components/UsersList';
import ChatHeader from './components/ChatHeader';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import MessageInput from './components/MessageInput';

const formatDate = (date: string) => {
	return new Date(date).toLocaleTimeString('en-US', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
	});
};

const ChatPage: React.FC = () => {
	const { user } = useUser();
	const { messages, fetchMessages, selectedUser, fetchUsers } = useChatStore();

	useEffect(() => {
		user && fetchUsers();
	}, [fetchUsers, user]);

	useEffect(() => {
		selectedUser?.clerkId && fetchMessages(selectedUser.clerkId);
	}, [selectedUser, fetchMessages]);
	return (
		<main className="h-full rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden">
			<TopBar />

			<div className="grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-[calc(100vh-180px)]">
				<UsersList />

				{/* chat messages */}
				<div className="flex flex-col h-full">
					{selectedUser ? (
						<>
							<ChatHeader />

							<ScrollArea className="h-[calc(100vh-340px)]">
								<div className="p-4 space-y-4">
									{messages.map((message) => (
										<div
											key={message._id}
											className={`flex items-start gap-3 ${
												message.senderId === user?.id ? 'flex-row-reverse' : ''
											}`}>
											<Avatar className="size-8">
												<AvatarImage
													src={
														message.senderId === user?.id
															? user.imageUrl
															: selectedUser.imageUrl
													}
												/>
											</Avatar>

											<div
												className={`rounded-lg p-3 max-w-[70%] ${
													message.senderId === user?.id ? 'bg-green-500' : 'bg-zinc-800'
												}`}>
												<p className="text-sm">{message.content}</p>
												<span className="text-xs text-zinc-300 mt-1 block">
													{formatDate(message.createdAt)}
												</span>
											</div>
										</div>
									))}
								</div>
							</ScrollArea>

							<MessageInput />
						</>
					) : (
						<NoConversationPlaceholder />
					)}
				</div>
			</div>
		</main>
	);
};

export default ChatPage;

const NoConversationPlaceholder = () => (
	<div className="flex flex-col items-center justify-center h-full space-y-6">
		<img src="/spotify.png" alt="Spotify" className="size-16 animate-bounce" />
		<div className="text-center">
			<h3 className="text-zinc-300 text-lg font-medium mb-1">No conversation selected</h3>
			<p className="text-zinc-500 text-sm">Choose a friend to start chatting</p>
		</div>
	</div>
);
