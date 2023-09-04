import React, { useEffect, useRef, useState } from 'react'

import styled from 'styled-components'

import { Input } from 'scripts/components/ui/Input'
import { TelegramManager } from 'scripts/methods/telegram'
import { mergeClasses } from 'scripts/methods/helpers'

export function Login ({ onLogin }) {
  const [ step, setStep ] = useState(STEP_PHONE)
  const [ error, setError ] = useState(null)

  const buttonRef = useRef()

  const inputCallback = (id, nextStep) => {
    return async () => {
      return await new Promise((resolve) => {
        buttonRef.current.addEventListener('click', function onClick () {
          const value = document.getElementById(id).value

          resolve(value)

          setStep(nextStep)

          buttonRef.current.removeEventListener('click', onClick)
        })
      })
    }
  }

  async function login () {
    await TelegramManager.login(
      inputCallback('telegram-input-phone', STEP_CODE),
      inputCallback('telegram-input-code', STEP_PASSWORD),
      inputCallback('telegram-input-password', STEP_PASSWORD),
    )

    onLogin()
  }

  useEffect(() => {
    window.requestAnimationFrame(login)
  }, [])

  return <div>
    {
      step === STEP_PHONE && <PaddedInput
        id='telegram-input-phone'
        type='text'
        placeholder='Номер телефону'
        startIcon={<i className='bi bi-phone' />}
      >
        Номер телефону
      </PaddedInput>
    }
    {
      step === STEP_CODE && <PaddedInput
        id='telegram-input-code'
        type='text'
        placeholder='Код для входу'
        startIcon={<i className='bi bi-123' />}
      >
        Код для входу
      </PaddedInput>
    }
    {
      step === STEP_PASSWORD && <PaddedInput
        id='telegram-input-password'
        type='password'
        placeholder='Пароль'
        startIcon={<i className='bi bi-asterisk' />}
      >
        Пароль
      </PaddedInput>
    }
    <button ref={buttonRef} className='btn btn-primary mt-3'>
      Далі
    </button>
  </div>
}

function PaddedInput (props) {
  return <PaddedInputContainer className='px-4 pb-2 pt-3'>
    <Input {...props} className={mergeClasses(props.className, 'w-100')} />
  </PaddedInputContainer>
}

const STEP_PHONE    = 'phone'
const STEP_CODE     = 'code'
const STEP_PASSWORD = 'password'

const PaddedInputContainer = styled('div')`
  border-radius: 18px;
  background: rgba(var(--ps-primanry), 0.25);
`