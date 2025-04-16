import React from 'react';
import { Button, Checkbox, FormGroup, Radio, SkipToContent } from '@patternfly/react-core';
import TermsOfUse from '@patternfly/chatbot/dist/dynamic/TermsOfUse';
import Chatbot, { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot';
import termsAndConditionsHeader from './PF-TermsAndConditionsHeader.svg';

export const TermsOfUseCompactExample: React.FunctionComponent = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(true);
  const [displayMode, setDisplayMode] = React.useState(ChatbotDisplayMode.default);
  const [hasImage, setHasImage] = React.useState(true);
  const chatbotRef = React.useRef<HTMLDivElement>(null);
  const termsRef = React.useRef<HTMLDivElement>(null);

  const handleSkipToContent = (e) => {
    e.preventDefault();
    if (!isModalOpen && chatbotRef.current) {
      chatbotRef.current.focus();
    }
    if (isModalOpen && termsRef.current) {
      termsRef.current.focus();
    }
  };

  const handleModalToggle = (_event: React.MouseEvent | MouseEvent | KeyboardEvent) => {
    setIsModalOpen(!isModalOpen);
  };

  const onPrimaryAction = () => {
    // eslint-disable-next-line no-console
    console.log('Clicked primary action');
  };

  const onSecondaryAction = () => {
    // eslint-disable-next-line no-console
    console.log('Clicked secondary action');
  };

  const introduction = (
    <>
      <p>
        Welcome to PatternFly! These terms and conditions outline the rules and regulations for the use of PatternFly's
        website, located at <a href="https://patternfly.org">www.patternfly.org.</a>
      </p>
      <p>
        By accessing this website, you are agreeing with our terms and conditions. If you do not agree to all of these
        terms and conditions, do not continue to use PatternFly.
      </p>
    </>
  );

  const terminology = (
    <>
      <p>
        The following terminology applies to these Terms and Conditions, Privacy Statement, Disclaimer Notice, and all
        Agreements:
      </p>
      <ul>
        <li>
          "Client", "You", and "Your" refer to you, the person using this website who is compliant with the Company's
          terms and conditions.
        </li>
        <li>
          "The Company", "Ourselves", "We", "Our", and "Us", refer to our Company. "Party", "Parties", or "Us", refers
          to both the Client and ourselves.
        </li>
      </ul>
    </>
  );

  const body = (
    <>
      <h2>Introduction</h2>
      {introduction}
      <h2>Terminology</h2>
      {terminology}
    </>
  );

  return (
    <>
      <SkipToContent style={{ zIndex: '999' }} onClick={handleSkipToContent} href="#">
        Skip to chatbot
      </SkipToContent>
      <div
        style={{
          position: 'fixed',
          padding: 'var(--pf-t--global--spacer--lg)',
          zIndex: '601',
          boxShadow: 'var(--pf-t--global--box-shadow--lg)'
        }}
      >
        <FormGroup role="radiogroup" isInline fieldId="basic-form-radio-group" label="Display mode">
          <Radio
            isChecked={displayMode === ChatbotDisplayMode.default}
            onChange={() => setDisplayMode(ChatbotDisplayMode.default)}
            name="basic-inline-radio"
            label="Default"
            id="default"
          />
          <Radio
            isChecked={displayMode === ChatbotDisplayMode.docked}
            onChange={() => setDisplayMode(ChatbotDisplayMode.docked)}
            name="basic-inline-radio"
            label="Docked"
            id="docked"
          />
          <Radio
            isChecked={displayMode === ChatbotDisplayMode.fullscreen}
            onChange={() => setDisplayMode(ChatbotDisplayMode.fullscreen)}
            name="basic-inline-radio"
            label="Fullscreen"
            id="fullscreen"
          />
          <Radio
            isChecked={displayMode === ChatbotDisplayMode.embedded}
            onChange={() => setDisplayMode(ChatbotDisplayMode.embedded)}
            name="basic-inline-radio"
            label="Embedded"
            id="embedded"
          />
        </FormGroup>
        <Checkbox
          isChecked={hasImage}
          aria-label="Toggle whether terms and conditions has a header image"
          id="toggle-header-image"
          name="toggle-header-image"
          label="Has image in header"
          onChange={(_event, checked) => setHasImage(checked)}
        ></Checkbox>
        <Button onClick={handleModalToggle}>Launch modal</Button>
      </div>
      <Chatbot ref={chatbotRef} displayMode={displayMode} isVisible></Chatbot>
      <TermsOfUse
        ref={termsRef}
        displayMode={displayMode}
        isModalOpen={isModalOpen}
        handleModalToggle={handleModalToggle}
        onPrimaryAction={onPrimaryAction}
        onSecondaryAction={onSecondaryAction}
        image={hasImage ? termsAndConditionsHeader : undefined}
        altText={hasImage ? 'Open book' : undefined}
        isCompact
      >
        {body}
      </TermsOfUse>
    </>
  );
};
