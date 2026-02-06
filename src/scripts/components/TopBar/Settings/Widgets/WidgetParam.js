import React from 'react'

import { Dropdown, Select } from 'scripts/components/ui/Dropdown'
import { PARAM_TYPE_DROPDOWN } from 'scripts/methods/widgets'

export function WidgetParam ({ value, param, onChange }) {
  switch (param.type) {
    case PARAM_TYPE_DROPDOWN:
      return <Dropdown
        items={param.options}
        onItemSelect={onChange}
      >
        <Select className='btn btn-outline-primary btn-sm'>{ param.options[value] }</Select>
      </Dropdown>
  }
}