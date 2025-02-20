import React from 'react';

import { SplitItem } from '@patternfly/react-core';
import { ChatbotDisplayMode } from '../Chatbot/Chatbot';

export interface ChatbotHeaderTitleProps {
  /** Content to be displayed in the chatbot header */
  children?: React.ReactNode;
  /** Custom classname for the header component */
  className?: string;
  /** Display mode of chatbot, in case you want to conditionally show a title */
  displayMode?: ChatbotDisplayMode;
  /** Content to display on full screen */
  showOnFullScreen?: React.ReactNode | string;
  /** Content to display on docked screen */
  showOnDocked?: React.ReactNode | string;
  /** Content to display on embedded screen */
  showOnEmbedded?: React.ReactNode | string;
  /** Content to display in drawer mode */
  showOnDrawer?: React.ReactNode | string;
  /** Content to display by default; this will be shown if a case is not explicitly set */
  showOnDefault?: React.ReactNode | string;
}

export const ChatbotHeaderTitle: React.FunctionComponent<ChatbotHeaderTitleProps> = ({
  className,
  children,
  displayMode,
  showOnFullScreen,
  showOnDocked,
  showOnEmbedded,
  showOnDrawer,
  showOnDefault
}: ChatbotHeaderTitleProps) => {
  const renderChildren = () => {
    if (displayMode) {
      /* eslint-disable indent */
      switch (displayMode) {
        case ChatbotDisplayMode.fullscreen:
          return showOnFullScreen ?? showOnDefault;
        case ChatbotDisplayMode.docked:
          return showOnDocked ?? showOnDefault;
        case ChatbotDisplayMode.embedded:
          return showOnEmbedded ?? showOnDefault;
        case ChatbotDisplayMode.drawer:
          return showOnDrawer ?? showOnDefault;
        default:
          return showOnDefault;
      }
      /* eslint-enable indent */
    } else {
      return children;
    }
  };
  return (
    <SplitItem isFilled className={`pf-chatbot__title ${className || ''}`}>
      {renderChildren()}
    </SplitItem>
  );
};

export default ChatbotHeaderTitle;
