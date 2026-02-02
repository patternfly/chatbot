import type { FC, ReactNode } from 'react';
import RocketIcon from '@patternfly/react-icons/dist/js/icons/rocket-icon';
import OutlinedBookmarkIcon from '@patternfly/react-icons/dist/js/icons/outlined-bookmark-icon';
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  CardTitle,
  Icon,
  Button,
  Flex,
  Stack,
  Label,
  pluralize
} from '@patternfly/react-core';
import OutlinedClockIcon from '@patternfly/react-icons/dist/js/icons/outlined-clock-icon';
import QuickStartTileHeader from './QuickStartTileHeader';
import QuickStartTileDescription from './QuickStartTileDescription';
import { QuickStart, QuickstartAction } from './types';
import FallbackImg from './FallbackImg';

export const camelize = (str: string) =>
  str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) {
      return '';
    } // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });

export interface QuickStartTileProps {
  /** ClassName applied to the card */
  className?: string;
  /** The quickstart object triggered by this tile */
  quickStart: QuickStart;
  /** Event handler attached to the tile */
  onClick?: () => void;
  /** Action config for button rendered next to title */
  action?: QuickstartAction;
  /** Callback that returns active quick start value when clicked */
  onSelectQuickStart: (id?: string) => void;
  /** Label for the English word "minute". */
  minuteWord?: string;
  /** Label for the English word "minutes". */
  minuteWordPlural?: string;
  /** Label for the English word "Prerequisite" */
  prerequisiteWord?: string;
  /** Label for the English word "Prerequisites" */
  prerequisiteWordPlural?: string;
  /** Aria-label for the quick start description button */
  quickStartButtonAriaLabel?: string;
  /** Sets the tile to compact styling */
  isCompact?: boolean;
}

export const QuickStartTile: FC<QuickStartTileProps> = ({
  className,
  quickStart,
  onClick,
  onSelectQuickStart,
  minuteWord = 'minute',
  minuteWordPlural = 'minutes',
  prerequisiteWord,
  prerequisiteWordPlural,
  quickStartButtonAriaLabel,
  action,
  isCompact
}) => {
  const {
    metadata: { name: id },
    spec: { icon, displayName, description, durationMinutes, prerequisites, link, type }
  } = quickStart;

  let quickStartIcon: ReactNode;
  if (typeof icon === 'object') {
    quickStartIcon = <Icon size="2xl">{icon}</Icon>;
  } else {
    quickStartIcon = (
      <Icon size="2xl">
        <FallbackImg src={icon as string} alt="" className="pfext-catalog-item-icon__img" fallback={<RocketIcon />} />
      </Icon>
    );
  }

  const onSelect = () => {
    if (!link) {
      onSelectQuickStart(id);
    } else {
      window.open(link.href, '_blank', 'noopener,noreferrer');
    }
    onClick && onClick();
  };

  const ActionIcon = action?.icon || OutlinedBookmarkIcon;
  const additionalAction = action ? (
    <Button
      aria-label={action['aria-label']}
      icon={<ActionIcon />}
      variant="plain"
      onClick={action.onClick}
      {...action.buttonProps}
    />
  ) : undefined;

  return (
    <Card
      className={`pf-chatbot__quickstarts-tile ${className ? className : ''}`}
      id={`${id}-chatbot-qs-tile`}
      style={{ height: '100%' }}
      data-testid={`chatbot-qs-card-${camelize(displayName)}`}
      isCompact={isCompact}
    >
      <CardHeader
        {...(action && {
          actions: { actions: additionalAction }
        })}
      >
        {quickStartIcon}
      </CardHeader>
      <CardTitle>
        <QuickStartTileHeader name={displayName} onSelect={onSelect} quickStartId={id} />
      </CardTitle>
      <CardBody>
        <Stack hasGutter>
          <Flex spaceItems={{ default: 'spaceItemsSm' }}>
            {type && <Label color={type.color}>{type.text}</Label>}
            {durationMinutes && (
              <Label variant="outline" data-test="duration" icon={<OutlinedClockIcon />}>
                {pluralize(durationMinutes, minuteWord, minuteWordPlural)}
              </Label>
            )}
          </Flex>
          <QuickStartTileDescription
            description={description}
            prerequisites={prerequisites}
            prerequisiteWord={prerequisiteWord}
            prerequisiteWordPlural={prerequisiteWordPlural}
            quickStartButtonAriaLabel={quickStartButtonAriaLabel}
          />
        </Stack>
      </CardBody>
      <CardFooter>
        <Button variant="link" isInline onClick={onSelect}>
          <span className="pf-v6-c-button__text">Start</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuickStartTile;
