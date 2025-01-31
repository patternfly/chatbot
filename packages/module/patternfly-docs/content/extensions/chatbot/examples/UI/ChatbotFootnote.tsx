import React from 'react';
import { ChatbotFootnote } from '@patternfly/chatbot/dist/dynamic/ChatbotFooter';

export const FootnoteDemo: React.FunctionComponent = () => (
  <ChatbotFootnote
    label="ChatBot uses AI. Check for mistakes."
    popover={{
      title: 'Verify information',
      description: `While ChatBot strives for accuracy, AI is experimental and can make mistakes. We cannot guarantee that all information provided by ChatBot is up to date or without error. You should always verify responses using reliable sources, especially for crucial information and decision making.`,
      bannerImage: {
        src: 'https://cdn.dribbble.com/userupload/10651749/file/original-8a07b8e39d9e8bf002358c66fce1223e.gif',
        alt: 'Example image for footnote popover'
      },
      cta: {
        label: 'Dismiss',
        onClick: () => {
          alert('Do something!');
        }
      },
      link: {
        label: 'View AI policy',
        url: 'https://www.redhat.com/'
      }
    }}
  />
);
