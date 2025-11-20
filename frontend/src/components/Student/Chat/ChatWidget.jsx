import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FiSend, FiX, FiBookOpen, FiMessageCircle, FiCpu } from "react-icons/fi";
import { FaRobot } from "react-icons/fa6";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import MarkdownErrorBoundary from "./MarkdownErrorBoundary";

const ChatWidget = ({ open, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [useRag, setUseRag] = useState(true);

    const chatEndRef = useRef(null);
    const inputRef = useRef(null); // FIXED

    const ML_SERVER_URL = import.meta.env.VITE_ML_SERVER_URL || "http://localhost:8000";

    // Auto scroll
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    // Focus + welcome message
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 150);

            if (messages.length === 0) {
                setMessages([
                    {
                        sender: "bot",
                        text: "Hi 👋 I'm your AI study assistant.\nSwitch between **Syllabus Mode** and **General Chat** anytime.",
                    },
                ]);
            }
        }
    }, [open]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { sender: "user", text: input.trim() };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        const formData = new FormData();
        formData.append("query", userMsg.text);

        const query = useRag ? "chat" : "general-chat";

        try {
            const res = await axios.post(`${ML_SERVER_URL}/${query}/gemini`, formData);

            if (res.data?.success) {
                setMessages((prev) => [...prev, { sender: "bot", text: res.data.response }]);
            }
        } catch {
            setMessages((prev) => [...prev, { sender: "bot", text: "⚠️ Could not reach AI server." }]);
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    };

    const toggleMode = () => {
        const next = !useRag;
        setUseRag(next);
        setMessages((prev) => [
            ...prev,
            {
                sender: "system",
                text: next ? "📚 Switched to Syllabus Mode" : "💬 Switched to General Chat",
            },
        ]);
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0  bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose} // CLOSE ON OUTER CLICK
        >
            {/* CHAT BOX */}
            <div
                onClick={(e) => e.stopPropagation()} // PREVENT closing when clicking inside
                className="w-full max-w-3xl h-[85vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden animate-scaleIn"
            >
                {/* HEADER */}
                <div className="flex items-center justify-between bg-indigo-600 text-white px-5 py-3">
                    <div className="flex items-center gap-3">
                        <FaRobot size={22} />
                        <div>
                            <p className="text-sm font-semibold">AI Assistant</p>
                            <p className="text-[11px] opacity-80">{useRag ? "Syllabus Mode" : "General Chat"}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* MESSAGES */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
                    {messages.map((msg, i) => (
                        <MessageBubble
                            key={i}
                            sender={msg.sender}
                            text={msg.text}
                        />
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="px-4 py-2 bg-white rounded-xl shadow text-sm flex items-center gap-2">
                                <div className="animate-ping w-2 h-2 rounded-full bg-gray-400"></div>
                                Thinking...
                            </div>
                        </div>
                    )}

                    <div ref={chatEndRef} />
                </div>

                {/* INPUT AREA */}
                <div className="p-3 border-t border-neutral-300 bg-white">
                    {/* TOGGLE SWITCH */}
                    <div className="flex items-center justify-center mb-2 gap-4">
                        <FiMessageCircle
                            size={18}
                            className={!useRag ? "text-indigo-600" : "text-gray-400"}
                        />

                        <button
                            onClick={toggleMode}
                            className={`relative w-12 h-6 rounded-full ${useRag ? "bg-indigo-600" : "bg-gray-300"}`}
                        >
                            <div
                                className={`absolute -translate-y-1/2 h-5 w-5 bg-white rounded-full shadow transform transition ${
                                    useRag ? "translate-x-6 " : "translate-x-1"
                                }`}
                            ></div>
                        </button>

                        <FiBookOpen
                            size={18}
                            className={useRag ? "text-indigo-600" : "text-gray-400"}
                        />
                    </div>

                    {/* INPUT BOX */}
                    <form
                        onSubmit={handleSend}
                        className="flex items-center gap-2"
                    >
                        <input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={loading}
                            className="flex-1  px-4 py-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder={useRag ? "Ask syllabus-based questions..." : "Ask anything..."}
                        />

                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 text-center rounded-xl shadow disabled:opacity-40"
                        >
                            <FiSend size={24} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// MESSAGE BUBBLE
const MessageBubble = ({ sender, text }) => {
    const isUser = sender === "user";
    const isSystem = sender === "system";

    if (isSystem) return <div className="flex justify-center text-xs italic text-gray-500">{text}</div>;

    const safeText = typeof text === "string" ? text : String(text || "");

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm shadow ${
                    isUser ? "bg-indigo-600 text-white rounded-br-none" : "bg-white text-gray-800 rounded-bl-none"
                }`}
            >
                <MarkdownErrorBoundary>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            p: (props) => (
                                <p
                                    className="mb-1 leading-relaxed"
                                    {...props}
                                />
                            ),
                            strong: (props) => (
                                <strong
                                    className="font-semibold"
                                    {...props}
                                />
                            ),
                            ul: (props) => (
                                <ul
                                    className="list-disc ml-4 space-y-1"
                                    {...props}
                                />
                            ),
                            ol: (props) => (
                                <ol
                                    className="list-decimal ml-4 space-y-1"
                                    {...props}
                                />
                            ),
                            li: (props) => (
                                <li
                                    className="leading-relaxed"
                                    {...props}
                                />
                            ),
                            code: (props) => (
                                <code
                                    className="bg-gray-100 px-1 py-0.5 rounded text-red-600"
                                    {...props}
                                />
                            ),
                        }}
                    >
                        {safeText}
                    </ReactMarkdown>
                </MarkdownErrorBoundary>
            </div>
        </div>
    );
};

export default ChatWidget;
