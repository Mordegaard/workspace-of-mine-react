import React from 'react'

import { RoundButton } from 'scripts/components/Social/SourcesSelector/RoundButton'
import { mergeClasses } from 'scripts/methods/helpers'
import { Dropdown } from 'scripts/components/ui/Dropdown'
import { SocialController } from 'scripts/methods/social'
import VendorSocialBookmarks from 'scripts/methods/social/socialBookmarks/VendorSocialBookmarks'
import { sourceDescriptions } from 'scripts/methods/social/constants'
import { SocialIcon } from 'scripts/components/ui/SocialIcon'

export function BookmarksButton ({ selected, className, onSelect, ...props }) {
  const type = selected instanceof VendorSocialBookmarks ? selected.type : null

  function renderLabel (type) {
    return <div className='row g-0 align-items-baseline'>
      <span className='col-auto me-2 text-gray-500'>
        <SocialIcon type={type} />
      </span>
      <span className='col'>
        { sourceDescriptions[type].name }
      </span>
      <span className='col-auto ms-3'>
        [{ SocialController.socialBookmarks[type].ids.length }]
      </span>
    </div>
  }

  return <Dropdown
    selected={type}
    items={SocialController.types.map(value => ({ value, label: renderLabel(value) }))}
    onItemSelect={onSelect}
  >
    <RoundButton className={mergeClasses(className, type && 'btn-primary')} {...props}>
      <i className='bi bi-bookmark-heart' />
    </RoundButton>
  </Dropdown>
}