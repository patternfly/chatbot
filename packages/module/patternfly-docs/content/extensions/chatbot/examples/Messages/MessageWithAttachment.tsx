import React from 'react';

import Message from '@patternfly/chatbot/dist/dynamic/Message';
import PreviewAttachment from '@patternfly/chatbot/dist/dynamic/PreviewAttachment';
import AttachmentEdit from '@patternfly/chatbot/dist/dynamic/AttachmentEdit';
import userAvatar from './user_avatar.svg';

interface ModalData {
  code: string;
  fileName: string;
}

export const AttachmentMenuExample: React.FunctionComponent = () => {
  const [isPreviewModalOpen, setIsPreviewModalOpen] = React.useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState<boolean>(false);
  const [currentModalData, setCurrentModalData] = React.useState<ModalData>();

  const onClick = (event: React.MouseEvent, name: string) => {
    setCurrentModalData({ fileName: name, code: 'test' });
    setIsEditModalOpen(false);
    setIsPreviewModalOpen(true);
  };

  const onClose = (event: React.MouseEvent, name: string, id: number | string | undefined) => {
    // eslint-disable-next-line no-console
    console.log(`Closed attachment with name: ${name} and id: ${id}`);
  };

  return (
    <>
      <Message
        name="User"
        role="user"
        avatar={userAvatar}
        content="Here is an uploaded file:"
        attachments={[{ name: 'auth-operator.yml', id: '1', onClick, onClose }]}
      />
      <Message
        name="User"
        role="user"
        avatar={userAvatar}
        content="Here are 2 uploaded files:"
        attachments={[
          { name: 'auth-operator.yml', id: '1' },
          { name: 'patternfly.svg', id: '2' }
        ]}
      />
      {currentModalData && (
        <PreviewAttachment
          code={currentModalData?.code}
          fileName={currentModalData?.fileName}
          isModalOpen={isPreviewModalOpen}
          onEdit={() => {
            setIsPreviewModalOpen(false);
            setIsEditModalOpen(true);
          }}
          onDismiss={() => setCurrentModalData(undefined)}
          handleModalToggle={() => setIsPreviewModalOpen(false)}
        />
      )}
      {currentModalData && (
        <AttachmentEdit
          code={currentModalData?.code}
          fileName={currentModalData?.fileName}
          isModalOpen={isEditModalOpen}
          onSave={() => {
            setIsEditModalOpen(false);
          }}
          onCancel={() => setCurrentModalData(undefined)}
          handleModalToggle={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  );
};
