import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  SLATE_100,
  SLATE_400,
  SLATE_600,
} from '../../../constants/tailwindColors';
import { TOOLBAR_ICON_SIZE } from '../../../constants/sizes';
import { Tooltip } from 'react-tooltip';

export type Appearance = 'unselected' | 'selected' | 'disabled';

interface Props {
  icon: IconDefinition;
  appearance?: Appearance;
  tooltipId?: string;
  tooltipText?: string;
  isLast?: boolean;
  onClick: () => void;
}

const ToolBarButton: FC<Props> = ({
  icon,
  appearance = 'unselected',
  tooltipId,
  tooltipText,
  isLast = false,
  onClick: handleClick,
}) => {
  let iconColor = SLATE_100;
  if (appearance === 'selected') {
    iconColor = SLATE_600;
  } else if (appearance === 'disabled') {
    iconColor = SLATE_400;
  }

  return (
    <>
      <li
        className={`mt-${isLast ? 'auto' : '3'} ${isLast && 'mb-3'} w-[50%]`}
        data-tooltip-id={tooltipId ? tooltipId : undefined}
      >
        <button
          type='button'
          className={`w-[100%] h-[35px] flex justify-center items-center ${
            appearance === 'unselected' && null
          } ${
            appearance === 'selected' &&
            'bg-slate-100 border border-slate-100 rounded'
          } ${appearance === 'disabled' && null}`}
          onClick={handleClick}
          disabled={appearance === 'disabled'}
        >
          <FontAwesomeIcon
            icon={icon}
            size={TOOLBAR_ICON_SIZE}
            color={iconColor}
          />
        </button>
      </li>
      {tooltipId && (
        <Tooltip
          id={tooltipId}
          content={tooltipText}
          place='left'
          style={{ padding: '2px 5px' }}
          delayShow={900}
          noArrow
          opacity={1}
          offset={1}
        />
      )}
    </>
  );
};

export default ToolBarButton;
