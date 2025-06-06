import { Image, Send, X } from "lucide-react";
import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";


const MessageInput = () => {

    const [ text, setText ] = useState('');
    const [ imagePreview, setImagePreview ] = useState(null);
    const fileInputRef = useRef(null);
    const { sendMessage } = useChatStore();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if(!file.type.startsWith('image/')) {
            toast.error("Please select an image file");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => { /****** reader.onloadend is an event that fires when reading the file is complete (success or fail). ******/
            setImagePreview(reader.result); /****** reader.result will contain the file content as a base64-encoded string (e.g., "data:image/jpeg;base64,...). ******/
            /****** saves it into React state so can use it as an image source and display a preview in the UI. ******/
        };

        reader.readAsDataURL(file); /****** Tells the FileReader to read the file as a Data URL (base64 format). ******/
    }

    const removeImagePreview = () => {
        setImagePreview(null);

        if(fileInputRef.current) {
            fileInputRef.current.value = ""; /****** Set the file input to be null as well ******/
        }
    }

    const handleSendMessage = async(e) => {
        e.preventDefault(); /****** So it does not refresh the page ******/

        if(!text.trim() && !imagePreview) return;

        try {
            await sendMessage({
                text: text.trim(),
                image: imagePreview,
            });

            /****** Clear form ******/
            setText("");
            setImagePreview(null);
            if(fileInputRef.current) {
                fileInputRef.current.value = "";
            }

        } catch (error) {
            console.error("Failed to send message: ", error);
        }
    }

    return (
        <div className="p-4 w-full">
            {
                imagePreview && (
                    <div className="mb-3 flex items-center gap-2">
                        <div className="relative">
                            <img src={imagePreview} alt="preview" className="w-20 h-20 object-cover rounded-lg border border-zinc-700"/>
                            <button
                                onClick={removeImagePreview}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center hover:bg-base-300/50 transition-colors"
                                type="button"
                            >
                                <X className="w-4 h-4"/>
                            </button>
                        </div>
                    </div>
                )
            }

            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <div className="flex-1 flex gap-2">
                    <input
                        type="text"
                        placeholder="Type a message"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full input input-bordered rounded-lg input-sm sm:input-md"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        hidden
                    />

                    <button
                        type="button"
                        className={`hidden sm:flex btn btn-circle ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Image size={20}/>
                    </button>
                </div>

                <button
                    type="submit"
                    className="btn btn-sm btn-circle"
                    disabled={ !text.trim() && !imagePreview }
                >
                    <Send size={20}/>
                </button>
            </form>
        </div>
    )

};

export default MessageInput;