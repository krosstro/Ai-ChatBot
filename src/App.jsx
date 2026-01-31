import { useState } from "react";
import Header from "./components/Header";
import ChatMessage from "./components/ChatMessage";
import { formaTime} from "./utils/chatUtils";
import LoadingIndicator from "./components/LoadingIndicator";
import ChatInput from "./components/ChatInput";
import { generateContent } from "./services/geminiapi";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello, how can I help you",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const botResponse = await generateContent(input);

      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error in chat:", error);


      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: "⚠️ Sorry, something went wrong while generating a response. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={`flex flex-col h-screen ${darkMode ? "bg-gray-900" : "bg-white"}`}>
        <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-5xl mx-auto space-y-4">
            {messages.map((message) => {
              return (
                <ChatMessage
                  key={message.id}
                  darkMode={darkMode}
                  messages={message}
                  formaTime={formaTime}
                />
              );
            })}
            {isLoading && <LoadingIndicator darkMode={darkMode} />}
          </div>
        </div>

        <ChatInput
          darkMode={darkMode}
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          handleSendMessage={handleSendMessage}
        />
      </div>
    </>
  );
};

export default App;