import type { FC } from 'react';
import { useRef } from 'react';
import { Button, Flex, pluralize, Popover } from '@patternfly/react-core';
import { RhMicronsInformationFillIcon } from '@patternfly/react-icons';

interface QuickStartTileDescriptionProps {
  /** QuickStart description */
  description: string;
  /** QuickStart prerequisites */
  prerequisites?: string[];
  /** Label for the English word "Prerequisite" */
  prerequisiteWord?: string;
  /** Label for the English word "Prerequisites" */
  prerequisiteWordPlural?: string;
  /** Aria-label for the quick start button */
  quickStartButtonAriaLabel?: string;
}

/** This function is a helper for pluralizing strings stolen from React.
 *
 * @param {number} i The quantity of the string you want to pluralize
 * @param {string} singular The singular version of the string
 * @param {string} plural The change to the string that should occur if the quantity is not equal to 1.
 *                 Defaults to adding an 's'.
 */
export function pluralizeWord(i: number, singular: string, plural?: string) {
  if (!plural) {
    plural = `${singular}s`;
  }
  return `${i === 1 ? singular : plural}`;
}

const QuickStartTileDescription: FC<QuickStartTileDescriptionProps> = ({
  description,
  prerequisites,
  prerequisiteWord = 'Prerequisite',
  prerequisiteWordPlural = 'Prerequisites',
  quickStartButtonAriaLabel = 'Show prerequisites'
}) => {
  const prereqs = prerequisites?.filter((p) => p);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pluralizedPrereq = pluralizeWord(prereqs?.length || 0, prerequisiteWord, prerequisiteWordPlural);
  return (
    <>
      {description}
      {prereqs && prereqs.length > 0 && (
        <Flex spaceItems={{ default: 'spaceItemsSm' }}>
          <h5>{pluralize(prereqs.length, prerequisiteWord, prerequisiteWordPlural)}</h5>
          <Button
            variant="link"
            isInline
            data-testid="qs-card-prereqs"
            ref={buttonRef}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            aria-label={quickStartButtonAriaLabel}
          >
            <RhMicronsInformationFillIcon />
          </Button>
          <Popover
            aria-label={pluralizedPrereq}
            headerContent={pluralizedPrereq}
            triggerRef={buttonRef}
            bodyContent={
              <div>
                <ul aria-label={pluralizedPrereq}>
                  {prereqs.map((prerequisite, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <li key={index}>{prerequisite}</li>
                  ))}
                </ul>
              </div>
            }
          />
        </Flex>
      )}
    </>
  );
};
export default QuickStartTileDescription;
