import {
  useRef,
  useState,
  FunctionComponent,
  MouseEvent,
  CSSProperties,
  Ref,
  MouseEvent as ReactMouseEvent
} from 'react';
import {
  Button,
  Checkbox,
  SkipToContent,
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
  Stack
} from '@patternfly/react-core';
import Onboarding from '@patternfly/chatbot/dist/dynamic/Onboarding';
import Chatbot, { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot';
import onboardingHeader from './RH-Hat-Image.svg';

export const OnboardingExample: FunctionComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [displayMode, setDisplayMode] = useState(ChatbotDisplayMode.default);
  const [hasImage, setHasImage] = useState(true);
  const chatbotRef = useRef<HTMLDivElement>(null);
  const termsRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>('Select display mode');

  const handleSkipToContent = (e) => {
    e.preventDefault();
    if (!isModalOpen && chatbotRef.current) {
      chatbotRef.current.focus();
    }
    if (isModalOpen && termsRef.current) {
      termsRef.current.focus();
    }
  };

  const handleModalToggle = (_event: MouseEvent | MouseEvent | KeyboardEvent) => {
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
  const onSelect = (_event: ReactMouseEvent<Element, MouseEvent> | undefined, value: string | number | undefined) => {
    setSelected(value as string);
    setIsOpen(false);
    if (value === 'Default') {
      setDisplayMode(ChatbotDisplayMode.default);
    }
    if (value === 'Docked') {
      setDisplayMode(ChatbotDisplayMode.docked);
    }
    if (value === 'Fullscreen') {
      setDisplayMode(ChatbotDisplayMode.fullscreen);
    }
    if (value === 'Embedded') {
      setDisplayMode(ChatbotDisplayMode.embedded);
    }
  };

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const toggle = (toggleRef: Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      onClick={onToggleClick}
      isExpanded={isOpen}
      style={
        {
          width: '200px'
        } as CSSProperties
      }
    >
      {selected}
    </MenuToggle>
  );

  const body = 'Simplify your Red Hat journey with personalized assistance and seamless problem-solving.';

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
        <Stack hasGutter>
          <Select
            id="single-select"
            isOpen={isOpen}
            selected={selected}
            onSelect={onSelect}
            onOpenChange={(isOpen) => setIsOpen(isOpen)}
            toggle={toggle}
            shouldFocusToggleOnSelect
          >
            <SelectList>
              <SelectOption value="Default">Default</SelectOption>
              <SelectOption value="Docked">Docked</SelectOption>
              <SelectOption value="Fullscreen">Fullscreen</SelectOption>
              <SelectOption value="Embedded">Embedded</SelectOption>
            </SelectList>
          </Select>
          <Checkbox
            isChecked={hasImage}
            aria-label="Toggle whether terms and conditions has a header image"
            id="toggle-header-image"
            name="toggle-header-image"
            label="Has image in header"
            onChange={(_event, checked) => setHasImage(checked)}
          ></Checkbox>
          <Button onClick={handleModalToggle}>Launch modal</Button>
        </Stack>
      </div>
      <Chatbot ref={chatbotRef} displayMode={displayMode} isVisible></Chatbot>
      <Onboarding
        ref={termsRef}
        displayMode={displayMode}
        isModalOpen={isModalOpen}
        handleModalToggle={handleModalToggle}
        onPrimaryAction={onPrimaryAction}
        onSecondaryAction={onSecondaryAction}
        image={hasImage ? onboardingHeader : undefined}
        altText={hasImage ? 'Open book' : undefined}
        title="Redefine work in the age of AI"
      >
        {body}
      </Onboarding>
    </>
  );
};
