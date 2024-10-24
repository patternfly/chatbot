// ============================================================================
// Chatbot Layout - Chat - Welcome
// ============================================================================
import React from 'react';

import { Content, ContentVariants, Card, CardHeader, CardTitle, CardBody } from '@patternfly/react-core';

export interface ChatbotWelcomePromptProps extends React.HTMLProps<HTMLDivElement> {
  /** Title for the welcome message*/
  title: string;
  /** Welcome message */
  description: string;
  /** Custom basic prompts to help users coming for the first time to chatbot */
  prompts?: WelcomePrompt[];
  /** Custom classname for the WelcomePrompt component */
  className?: string;
}

export interface WelcomePrompt {
  /** Message for the welcome prompt */
  message: string;
  /** Title for the welcome prompt */
  title?: string;
  /** Callback handler for the onClick event for welcome prompt */
  onClick?: () => void;
}

export const ChatbotWelcomePrompt: React.FunctionComponent<ChatbotWelcomePromptProps> = ({
  title,
  description,
  prompts,
  className,
  ...props
}: ChatbotWelcomePromptProps) => (
  <div className={`pf-chatbot--layout--welcome ${className ?? ''}`} {...props}>
    <Content component={ContentVariants.h1}>
      <span className="pf-chatbot__hello">{title}</span>
      <br />
      <span className="pf-chatbot__question">{description}</span>
    </Content>

    <div className="pf-chatbot__prompt-suggestions">
      {prompts?.map((prompt, index) => (
        <Card key={`welcome-prompt-${index}`} className="pf-chatbot__prompt-suggestion" isClickable>
          <CardHeader
            selectableActions={{
              onClickAction: prompt.onClick,
              selectableActionId: `welcome-prompt-input-${index}`,
              selectableActionAriaLabelledby: `welcome-prompt-title-${index}`
            }}
          >
            <CardTitle id={`welcome-prompt-title-${index}`}>{prompt.title}</CardTitle>
          </CardHeader>
          <CardBody>{prompt.message}</CardBody>
        </Card>
      ))}
    </div>
  </div>
);

export default ChatbotWelcomePrompt;