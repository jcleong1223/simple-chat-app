import ChatHeader from "../components/ChatHeader";
import MessageSkeleton from "../components/loadingplaceholders/MessageSkeleton";
import MessageInput from "../components/MessageInput";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";


const ChatContainer = () => {

    const { messages, getMessages, isMessagesLoading, selectedUser } = useChatStore();

    /****** useEffect is a hook that will excute the function as soon as the application starts ******/
    useEffect(() => {
        getMessages(selectedUser._id);
    }, [selectedUser._id, getMessages]);
    /****** The dependency array added the selectedUser._id and getMessages function is because the state will be updated when the selectedUser._id changes, so the useEffect will excute the function as soon as the selectedUser._id changes ******/

    if(true) return (
    // if(isMessagesLoading) return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader/>
            <MessageSkeleton />
            <MessageInput/>
        </div>
    )


    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader/>

            <p>messages.....</p>

            <MessageInput/>

        </div>
    )
}

export default ChatContainer;