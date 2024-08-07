import { useContext } from 'react'

import { BreadcrumbsContext } from 'scripts/components/TopBar/Settings/Breadcrumbs'

export function useBreadcrumbs () {
  return useContext(BreadcrumbsContext)
}