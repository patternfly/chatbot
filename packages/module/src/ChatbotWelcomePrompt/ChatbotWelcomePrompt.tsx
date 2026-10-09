// ============================================================================
// Chatbot Layout - Chat - Welcome
// ============================================================================
import type { FunctionComponent } from 'react';

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
  /** Custom test id for the WelcomePrompt component */
  testId?: string;
  isCompact?: boolean;
}

export interface WelcomePrompt {
  /** Message for the welcome prompt */
  message?: string;
  /** Title for the welcome prompt */
  title: string;
  /** Callback handler for the onClick event for welcome prompt */
  onClick?: () => void;
}

export const ChatbotWelcomePrompt: FunctionComponent<ChatbotWelcomePromptProps> = ({
  title,
  description,
  prompts,
  className,
  testId,
  isCompact = false,
  ...props
}: ChatbotWelcomePromptProps) => (
  <div
    data-testid={testId}
    className={`pf-chatbot--layout--welcome ${isCompact ? 'pf-m-compact' : ''} ${className ?? ''}`}
    {...props}
  >
    <Content component={ContentVariants.h1}>
      <span className="pf-chatbot__hello">{title}</span>
      <br />
      <span className="pf-chatbot__question">{description}</span>
    </Content>

    {prompts && (
      <div className="pf-chatbot__prompt-suggestions">
        {prompts?.map((prompt, index) => (
          <Card
            key={`welcome-prompt-${index}`}
            className="pf-chatbot__prompt-suggestion"
            isClickable
            isCompact={isCompact}
          >
            <CardHeader
              selectableActions={{
                onClickAction: prompt.onClick,
                selectableActionId: `welcome-prompt-input-${index}`,
                selectableActionAriaLabelledby: `welcome-prompt-title-${index}`
              }}
            >
              <CardTitle className="pf-chatbot__prompt-suggestion-title" id={`welcome-prompt-title-${index}`}>
                {prompt.title}
              </CardTitle>
            </CardHeader>
            {prompt.message && <CardBody className="pf-chatbot__prompt-suggestion-body">{prompt.message}</CardBody>}
          </Card>
        ))}
      </div>
    )}
  </div>
);

export default ChatbotWelcomePrompt;
