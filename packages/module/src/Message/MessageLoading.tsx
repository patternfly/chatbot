// ============================================================================
// Chatbot Main - Message - Processing
// ============================================================================

const MessageLoading = ({ loadingWord, isPrimary }) => (
  <div className={`pf-chatbot__message-loading ${isPrimary ? 'pf-m-primary' : ''}`}>
    <span className="pf-chatbot__message-loading-dots">
      <span className="pf-v6-screen-reader">{loadingWord}</span>
    </span>
  </div>
);

export default MessageLoading;
