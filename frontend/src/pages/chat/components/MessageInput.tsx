import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatStore } from '@/store/useChatStore';
import { useUser } from '@clerk/clerk-react';
import { Send } from 'lucide-react';

const MessageInput = () => {
	const [newMessage, setNewMessage] = useState('');
	const { user } = useUser();
	const { selectedUser, sendMessage } = useChatStore();

	const handleSendMessage = () => {
		if (!user || !selectedUser || !newMessage) return;

		sendMessage(selectedUser.clerkId, user.id, newMessage.trim());
		setNewMessage('');
	};

	return (
		<div className="p-4 mt-auto border-t border-zinc-800">
			<div className="flex gap-2">
				<Input
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					placeholder="Type a message..."
					className="bg-zinc-800 border-none placeholder:text-zinc-500"
					onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
				/>

				<Button
					size={'icon'}
					onClick={handleSendMessage}
					className="bg-green-500 hover:bg-green-400 hover:scale-105 transition-all"
					disabled={!newMessage.trim()}>
					<Send className="size-4" />
				</Button>
			</div>
		</div>
	);
};

export default MessageInput;
