import React from 'react'

import Events from 'scripts/methods/events'
import { AnimatedContextMenuContainer, ContextMenu } from 'scripts/components/ui/Helpers/ContextMenu'
import { SocialController } from 'scripts/methods/social'
import { PopperPortal } from 'scripts/components/ui/Helpers/PopperPortal'

export function SourceContextMenu ({ source, ...props }) {
  if (source.key == null) {
    return null
  }

  return <PopperPortal>
    <ContextMenu {...props}>
      <AnimatedContextMenuContainer>
        <a
          href={ source.url }
          className='btn btn-sm btn-basic-gray-600 w-100 d-block'
        >
          <div className='w-100 text-start'>
            <i className='bi bi-box-arrow-up-right me-3'/>
            Відкрити у <span className='text-capitalize'>{ source.type }</span>
          </div>
        </a>
        <button
          className='btn btn-sm btn-basic-gray-600 w-100 d-block'
          onClick={() => {
            SocialController.sources.update(source.key, { hidden: !source.hidden })
          }}
        >
          <div className='w-100 text-start'>
            {
              source.hidden
                ? <i className='bi bi-eye-slash me-3'/>
                : <i className='bi bi-eye me-3'/>
            }
            { source.hidden ? 'Не приховувати' : 'Приховати' }
          </div>
        </button>
        <button
          className='btn btn-sm btn-basic-gray-600 w-100 d-block'
          onClick={() => Events.trigger('sources:change', source.bookmarks)}
        >
          <div className='w-100 text-start'>
            <i className='bi bi-bookmark-heart me-3'/>
            Збережені ({ source.bookmarks.ids.length })
          </div>
        </button>
        <button
          className='btn btn-sm btn-basic-danger w-100 d-block'
          onClick={() => Events.trigger('dialog:sources:remove', source)}
        >
          <div className='w-100 text-start'>
            <i className='bi bi-trash me-3'/>
            Видалити
          </div>
        </button>
      </AnimatedContextMenuContainer>
    </ContextMenu>
  </PopperPortal>
}