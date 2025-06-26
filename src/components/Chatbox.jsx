import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaMicrophone } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { MdClose } from "react-icons/md";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef(null);

  const {
    transcript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      alert("Your browser does not support speech recognition.");
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (isListening && transcript) {
      setInput(transcript);
    }
  }, [transcript, isListening]);

  useEffect(() => {
    if (!listening && isListening && transcript.trim()) {
      sendMessage(transcript.trim());
      setIsListening(false);
      resetTranscript();
    }
  }, [listening]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text = input) => {
    if (!text.trim()) return;

    const userMessage = { text, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    resetTranscript();

    try {
      const { data } = await axios.post("http://localhost:5005/webhooks/rest/webhook", {
        message: text,
        sender: "user",
      });

      const botMessages = data.map((msg) => ({
        text: msg.text,
        sender: "bot",
      }));

      setMessages((prev) => [...prev, ...botMessages]);
    } catch (error) {
      console.error("Error fetching response from Rasa:", error);
    }
  };

  const startListening = () => {
    setIsListening(true);
    SpeechRecognition.startListening({ continuous: false });
  };

  const stopListening = () => {
    setIsListening(false);
    SpeechRecognition.stopListening();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-80 h-[450px] bg-gradient-to-br from-[#0a0f1c] to-[#0f172a] bg-opacity-80 backdrop-blur-md border border-[#00f7ff50] shadow-2xl rounded-xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00f7ff] to-[#004d99] text-black font-bold p-3 flex justify-between items-center">
          <h2 className="text-md tracking-wider uppercase">⚡ AI Chatbot</h2>
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="cursor-pointer text-xl text-black"
            onClick={() => console.log("Close button clicked (optional)")}
          >
            <MdClose />
          </motion.button>
        </div>

        {/* Chat Area */}
        <div className="p-2 h-full overflow-y-auto space-y-2 overflow-x-hidden flex-1 text-white">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: msg.sender === "user" ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`p-2 rounded-lg max-w-xs text-sm ${
                msg.sender === "user"
                  ? "bg-gradient-to-r from-cyan-600 to-blue-700 text-white self-end ml-auto shadow-md"
                  : "bg-[#141c2f] text-[#00f7ff] self-start mr-auto shadow-inner"
              }`}
            >
              {msg.text}
            </motion.div>
          ))}
          <div ref={chatEndRef}></div>
        </div>

        {/* Input Area */}
        <div className="p-2 border-t border-[#00f7ff40] flex items-center gap-1">
          <input
            type="text"
            className="flex-1 border border-[#00f7ff60] bg-[#0f172a] text-white placeholder-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          {/* Send Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-2 rounded-full shadow-lg"
            onClick={() => sendMessage()}
          >
            <IoMdSend className="text-base" />
          </motion.button>

          {/* Microphone Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-full shadow-lg text-white text-base ${
              isListening
                ? "bg-red-600 animate-pulse"
                : "bg-gradient-to-r from-purple-700 to-pink-700"
            }`}
            onClick={isListening ? stopListening : startListening}
          >
            <FaMicrophone />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Chatbot;
