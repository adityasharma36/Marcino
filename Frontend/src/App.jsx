
// import LandingPage from "./Pages/LandingPage";

import Login from "./Pages/Login";
import MainRoutes from "./Routes/MainRoutes";
import { ChatbotProvider } from "./Chatbot/ChatbotContext";
import ChatbotWidget from "./Chatbot/ChatbotWidget";
const App = () => {
  return (
    <ChatbotProvider>
      <MainRoutes />
      <ChatbotWidget />
    </ChatbotProvider>
  )
}

export default App