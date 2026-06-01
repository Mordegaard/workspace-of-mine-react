import React from 'react'

import { ErrorBoundary, getErrorMessage } from 'react-error-boundary'

export function SmallErrorBoundary ({ children, ...rest }) {
  return <ErrorBoundary
    fallbackRender={({ error, resetErrorBoundary }) =>
      <div className='text-center p-2 bg-body'>
        <span className='d-inline-flex p-2 rounded-circle bg-warning lh-0' style={{ '--bs-bg-opacity': 0.25 }}>
          <i className='bi bi-exclamation-triangle-fill' />
        </span>
        <p className='fw-medium py-2'>Щось пішло не так</p>
        <pre>{ getErrorMessage(error) }</pre>
        <button className='btn btn-outline-primary w-100' onClick={resetErrorBoundary}>
          Retry
        </button>
      </div>
    }
    onError={ (error, info) => {
      console.error(error, info)
    }}
    {...rest}
  >
    { children }
  </ErrorBoundary>
}