/**
 * Dynamic per-component import via dist/dynamic.
 */
import ChatbotToggle from '@patternfly/chatbot/dist/dynamic/ChatbotToggle';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/chatbot/dist/css/main.css';

export default function App() {
  return (
    <>
      <ChatbotToggle tooltipLabel="Chatbot" isChatbotVisible={false} onToggleChatbot={() => undefined} />
    </>
  );
}
