import ChatHeader from "../components/ChatHeader";
import MessageSkeleton from "../components/loadingplaceholders/MessageSkeleton";
import MessageInput from "../components/MessageInput";
import { formatMessageTime } from "../lib/utils";
import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";


const ChatContainer = () => {


    const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
    const { authUser } = useAuthStore();
    const messageEndRef = useRef(null);

    /****** useEffect is a hook that will excute the function as soon as the application starts ******/
    useEffect(() => {
        getMessages(selectedUser._id);

        subscribeToMessages();

        return () => unsubscribeFromMessages();

    }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);
    /****** The dependency array added the selectedUser._id and getMessages function is because the state will be updated when the selectedUser._id changes, so the useEffect will excute the function as soon as the selectedUser._id changes ******/

    useEffect(() => {

        if(messageEndRef.current && messages)
        {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);
    /****** The dependency array added the messages is because whenever the messages changes, the useEffect will excute the function ******/


    // if(true) return (
    if(isMessagesLoading) return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader/>
            <MessageSkeleton />
            <MessageInput/>
        </div>
    )


    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader/>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                { messages.map((message) => (
                    <div 
                        key={message._id}
                        className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                        ref={messageEndRef}
                    >
                        <div className="chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img src={message.sender_id === authUser._id ? authUser.profilePic || "/avatar.jpg" : selectedUser.profilePic || "/avatar.jpg"} alt="profile pic"/>
                            </div>
                        </div>

                        <div className="chat-header mb-1">
                            <time className="text-xs opacity-50 ml-1">{formatMessageTime(message.createdAt) || message.createdAt || "Loading..."}</time>
                        </div>

                        <div className="chat-bubble flex flex-col">
                            {
                                message.image && (
                                    <img src={message.image} alt="message image" className="sm:max-w-[200px] rounded-md mb-2"/>
                                )
                            }
                            {
                                message.text && (
                                    <p>{message.text}</p>
                                )
                            }
                        </div>
                    </div>
                ))
                }
            </div>

            <MessageInput/>

        </div>
    )
}

export default ChatContainer;