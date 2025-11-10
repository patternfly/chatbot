import { useState, isValidElement, cloneElement, Children, FunctionComponent, ReactNode } from 'react';
import AttachMenu from '@patternfly/chatbot/dist/dynamic/AttachMenu';
import SourceDetailsMenuItem from '@patternfly/chatbot/dist/dynamic/SourceDetailsMenuItem';
import { Button, Divider, DropdownGroup, DropdownItem, DropdownList } from '@patternfly/react-core';
import { BellIcon, CodeIcon, ClipboardIcon, CalendarAltIcon, UploadIcon } from '@patternfly/react-icons';
import PaperclipIcon from './PaperclipIcon';

const initialMenuItems = [
  <DropdownList key="list-1">
    <DropdownItem className="pf-chatbot-source-details-dropdown-item" value="auth-operator Pod" id="0">
      <SourceDetailsMenuItem
        icon={
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 12.5C0 5.87258 5.37258 0.5 12 0.5C18.6274 0.5 24 5.87258 24 12.5C24 19.1274 18.6274 24.5 12 24.5C5.37258 24.5 0 19.1274 0 12.5Z"
              fill="currentColor"
            />
            <g clipPath="url(#clip0_3280_27488)">
              <path
                d="M8.25 8.75C8.25 7.92266 8.92266 7.25 9.75 7.25H12C14.0719 7.25 15.75 8.92812 15.75 11C15.75 13.0719 14.0719 14.75 12 14.75H9.75V17C9.75 17.4148 9.41484 17.75 9 17.75C8.58516 17.75 8.25 17.4148 8.25 17V14V8.75ZM9.75 13.25H12C13.2422 13.25 14.25 12.2422 14.25 11C14.25 9.75781 13.2422 8.75 12 8.75H9.75V13.25Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_3280_27488">
                <rect width="7.5" height="12" fill="white" transform="translate(8.25 6.5)" />
              </clipPath>
            </defs>
          </svg>
        }
        name="auth-operator"
        type="Pod"
      />
    </DropdownItem>
  </DropdownList>,
  <DropdownGroup key="group2">
    <DropdownList>
      <DropdownItem value="Alerts" id="1" icon={<BellIcon />}>
        Alerts
      </DropdownItem>
      <DropdownItem value="Events" id="2" icon={<CalendarAltIcon />}>
        Events
      </DropdownItem>
      <DropdownItem value="Logs" id="3" icon={<ClipboardIcon />}>
        Logs
      </DropdownItem>
      <DropdownItem value="YAML - Status" id="4" icon={<CodeIcon />}>
        YAML - Status
      </DropdownItem>
      <DropdownItem value="YAML - All contents" id="5" icon={<CodeIcon />}>
        YAML - All contents
      </DropdownItem>
    </DropdownList>
  </DropdownGroup>
];

const uploadMenuItems = [
  <Divider key="divider" />,
  <DropdownList key="list-2">
    <DropdownItem key="upload" value="upload" id="upload" icon={<UploadIcon />}>
      Upload from computer
    </DropdownItem>
  </DropdownList>
];

export const AttachmentMenuExample: FunctionComponent = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [userFacingMenuItems, setUserFacingMenuItems] = useState<ReactNode>([]);

  const onToggleClick = () => {
    setIsOpen(!isOpen);
    setUserFacingMenuItems(initialMenuItems.concat(uploadMenuItems));
  };

  const findMatchingElements = (elements: ReactNode[], targetValue: string) => {
    let matchingElements = [] as ReactNode[];

    elements.forEach((element) => {
      if (isValidElement(element)) {
        // Check if the element's value matches the targetValue
        if (element.props.value && element.props.value.toLowerCase().includes(targetValue.toLowerCase())) {
          matchingElements.push(cloneElement(element, { key: element.props.value }));
        }

        // Recursively check the element's children
        const children = Children.toArray(element.props.children);
        matchingElements = matchingElements.concat(findMatchingElements(children, targetValue));
      }
    });

    return matchingElements;
  };

  const onTextChange = (textValue: string) => {
    if (textValue === '') {
      setUserFacingMenuItems(initialMenuItems.concat(uploadMenuItems));
      return;
    }

    const newMenuItems = findMatchingElements(initialMenuItems, textValue);
    // this is necessary because the React nodes we find traversing the recursive search
    // aren't correctly wrapped in a DropdownList. This leads to problems with the
    // auth-operator item where it winds up floating in a bad place in the DOM and never
    // gets removed
    setUserFacingMenuItems(
      <>
        <DropdownList>
          {newMenuItems.length === 0 ? (
            <DropdownItem key="no-items">No results found</DropdownItem>
          ) : (
            newMenuItems.map((item) => item)
          )}
        </DropdownList>
        {uploadMenuItems.map((item) => item)}
      </>
    );
  };

  return (
    <AttachMenu
      filteredItems={userFacingMenuItems}
      isOpen={isOpen}
      onOpenChange={(isOpen) => setIsOpen(isOpen)}
      onOpenChangeKeys={['Escape']}
      // eslint-disable-next-line no-console
      onSelect={(_ev, value) => console.log('selected', value)}
      handleTextInputChange={onTextChange}
      popperProps={{ direction: 'up', distance: 8 }}
      searchInputPlaceholder="Search cluster resources..."
      toggle={(toggleRef) => (
        <Button
          style={{
            alignItems: 'center',
            borderRadius: '50%',
            display: 'flex',
            height: '48px',
            justifyContent: 'center',
            padding: '0',
            width: '48px',
            lineHeight: '1rem'
          }}
          ref={toggleRef}
          onClick={onToggleClick}
          icon={<img src={PaperclipIcon} alt="Add an attachment" />}
        />
      )}
    />
  );
};
