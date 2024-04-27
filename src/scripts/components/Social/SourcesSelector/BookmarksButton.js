import React from 'react'

import { RoundButton } from 'scripts/components/Social/SourcesSelector/RoundButton'
import { mergeClasses } from 'scripts/methods/helpers'
import { Dropdown } from 'scripts/components/ui/Dropdown'
import { SocialController } from 'scripts/methods/social'
import VendorSocialBookmarks from 'scripts/methods/social/socialBookmarks/VendorSocialBookmarks'

export function BookmarksButton ({ selected, className, onSelect, ...props }) {
  const type = selected instanceof VendorSocialBookmarks ? selected.type : null

  return <Dropdown
    selected={type}
    items={SocialController.types}
    onItemSelect={onSelect}
  >
    <RoundButton className={mergeClasses(className, type && 'btn-primary')} {...props}>
      <i className='bi bi-bookmark-heart' />
    </RoundButton>
  </Dropdown>
}