import { FunctionComponent } from 'react';
import Message, {
  ErrorMessage,
  MessageAndActions,
  MessageAttachmentItem,
  MessageAttachmentsContainer,
  MessageLoading
} from '@patternfly/chatbot/dist/dynamic/Message';
import MarkdownContent from '@patternfly/chatbot/dist/dynamic/MarkdownContent';
import ToolCall from '@patternfly/chatbot/dist/dynamic/ToolCall';
import ToolResponse from '@patternfly/chatbot/dist/dynamic/ToolResponse';
import FileDetailsLabel from '@patternfly/chatbot/dist/dynamic/FileDetailsLabel';
import ResponseActions, { ResponseActionsGroups } from '@patternfly/chatbot/dist/dynamic/ResponseActions';
import patternflyAvatar from './patternfly_avatar.jpg';
import userAvatar from './user_avatar.svg';

const handlePositiveResponse = () => {
  // Handle positive response
};

const handleNegativeResponse = () => {
  // Handle negative response
};

const handleCopy = () => {
  // Handle copy action
};

const handleDownload = () => {
  // Handle download action
};

const handleListen = () => {
  // Handle listen action
};

export const MessageWithCustomStructure: FunctionComponent = () => (
  <>
    <Message name="Bot" role="bot" avatar={patternflyAvatar}>
      <MessageAndActions>
        <MarkdownContent
          content={`This is a basic message with a more custom, fine-tuned structure. You can pass markdown to the MarkdownContent component, such as **bold content with double asterisks** or _italic content with single underscores_.`}
        />
        <ToolCall titleText="Calling 'awesome_tool'" loadingText="Loading 'awesome_tool'" isLoading={true} />
        <ToolResponse
          toggleContent="Tool response: fetch_user_data"
          subheading="Executed in 0.3 seconds"
          body="Successfully retrieved user data from the database."
          cardTitle="User Data Response"
          cardBody="The tool returned 150 user records matching the specified criteria."
        />
        <ErrorMessage title="An issue placed within this custom structure." />
        <MarkdownContent
          isMarkdownDisabled
          textComponent={`You can also pass plain text without markdown to the MarkdownContent component by passing the isMarkdownDisabled prop. Optionally, you can also use the textComponent prop instead of content.`}
        />
        <ToolCall titleText="Calling 'more_awesome_tool'" loadingText="Loading 'more_awesome_tool'" isLoading={true} />
        <ToolCall titleText="Calling 'even_more_awesome_tool'" loadingText="Loading 'even_more_awesome_tool'" />
        <MessageLoading loadingWord="Loading something in the middle of a custom structured message" />
        <MarkdownContent
          content={`You can even place a message loading state in the middle of a message, as seen above.`}
        />
        <ResponseActionsGroups>
          <ResponseActions
            actions={{
              positive: { onClick: handlePositiveResponse, ariaLabel: 'Good response' },
              negative: { onClick: handleNegativeResponse, ariaLabel: 'Bad response' }
            }}
            persistActionSelection={true}
          />
          <ResponseActions
            actions={{
              copy: { onClick: handleCopy, ariaLabel: 'Copy' },
              download: { onClick: handleDownload, ariaLabel: 'Download' }
            }}
            persistActionSelection={false}
          />
          <ResponseActions
            actions={{
              listen: { onClick: handleListen, ariaLabel: 'Listen' }
            }}
            persistActionSelection={true}
          />
        </ResponseActionsGroups>
      </MessageAndActions>
    </Message>
    <Message name="User" role="user" avatar={userAvatar}>
      <MessageAndActions>
        <MarkdownContent content="This message is in the MessageAndActions container, and the file attachments below are in their own separate MessageAttachmentsContainer!" />
      </MessageAndActions>
      <MessageAttachmentsContainer>
        <MessageAttachmentItem>
          <FileDetailsLabel fileName="project-report.pdf" />
        </MessageAttachmentItem>
        <MessageAttachmentItem>
          <FileDetailsLabel fileName="data-analysis.csv" />
        </MessageAttachmentItem>
        <MessageAttachmentItem>
          <FileDetailsLabel fileName="presentation-slides.pptx" />
        </MessageAttachmentItem>
      </MessageAttachmentsContainer>
    </Message>
  </>
);
