import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { createRoot } from 'react-dom/client'

import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview'
import { preventUnhandled } from '@atlaskit/pragmatic-drag-and-drop/prevent-unhandled'
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview'

/**
 * Компонент Draggable.
 *
 * Використовує render prop патерн, тому ви повністю контролюєте розмітку.
 * Прикріпіть `draggableRef` до вузла, який має стати draggable.
 * Якщо потрібен окремий handle — прикріпіть `dragHandleRef` до нього.
 *
 * Props:
 * @param {string}   id                     — унікальний ідентифікатор елемента
 * @param {object}   [data]                 — довільні дані для drag-події
 * @param {boolean}  [disabled=false]       — вимкнути перетягування
 * @param {ReactNode|((position: {x,y}) => ReactNode)} [dragPreview]
 *                                          — кастомний вузол для drag preview.
 *                                            Якщо передати функцію — отримає поточні
 *                                            координати курсора { x, y } і може
 *                                            використовувати їх для позиціонування.
 *                                            Рендериться через портал у document.body.
 * @param {string}   [previewStrategy='follow']
 *                                          — 'follow' (за курсором) | 'native' (нативний preview через setCustomNativeDragPreview)
 *                                            Якщо dragPreview не передано — нативний preview завжди вимкнений.
 * @param {Function} [children]             — render prop: ({ state, isDragging, draggableRef, dragHandleRef }) => ReactNode
 * @param {Function} [onDragStart]          — (id: string) => void
 * @param {Function} [onDragEnd]            — (id: string) => void
 *
 * Render prop отримує:
 * @yields {string}      state          — 'idle' | 'dragging' | 'disabled'
 * @yields {boolean}     isDragging     — скорочення для state === 'dragging'
 * @yields {RefObject}   draggableRef   — прикріпити до draggable-елемента
 * @yields {RefObject}   dragHandleRef  — прикріпити до drag handle (необов'язково)
 *
 * @example Базовий
 * <Draggable id="item-1" data={{ type: 'card' }}>
 *   {({ draggableRef, isDragging }) => (
 *     <StyledCard ref={draggableRef} $isDragging={isDragging}>
 *       Картка
 *     </StyledCard>
 *   )}
 * </Draggable>
 *
 * @example З кастомним preview (слідує за курсором)
 * <Draggable
 *   id="item-1"
 *   dragPreview={<StyledPreview>Моє preview</StyledPreview>}
 *   previewStrategy="follow"
 * >
 *   {({ draggableRef, isDragging }) => (
 *     <StyledCard ref={draggableRef} $isDragging={isDragging}>
 *       Картка
 *     </StyledCard>
 *   )}
 * </Draggable>
 *
 * @example З кастомним preview як функцією (для точного позиціонування)
 * <Draggable
 *   id="item-1"
 *   dragPreview={({ x, y }) => (
 *     <StyledPreview style={{ transform: `translate(${x + 12}px, ${y + 12}px)` }}>
 *       Preview
 *     </StyledPreview>
 *   )}
 * >
 *   {({ draggableRef }) => <StyledCard ref={draggableRef}>Картка</StyledCard>}
 * </Draggable>
 *
 * @example З нативним preview (setCustomNativeDragPreview)
 * <Draggable
 *   id="item-1"
 *   dragPreview={<StyledPreview>Preview</StyledPreview>}
 *   previewStrategy="native"
 * >
 *   {({ draggableRef }) => <StyledCard ref={draggableRef}>Картка</StyledCard>}
 * </Draggable>
 */
export function Draggable ({
  id,
  data,
  disabled = false,
  dragPreview,
  previewStrategy = 'follow',
  children,
  onDragStart,
  onDragEnd,
}) {
  const draggableRef = useRef(null)
  const dragHandleRef = useRef(null)

  const [ cursorPosition, setCursorPosition ] = useState({ x: 0, y: 0 })
  const [ state, setState ] = useState(disabled ? 'disabled' : 'idle')
  const [ isDraggingOver, setIsDraggingOver ] = useState(false)

  const isDragging = state === 'dragging'

  useEffect(() => {
    setState(disabled ? 'disabled' : 'idle')
  }, [ disabled ])

  useEffect(() => {
    const element = draggableRef.current

    if (!element || disabled) return

    const handle = dragHandleRef.current ?? undefined
    const hasCustomPreview = Boolean(dragPreview)
    const useNativeStrategy = previewStrategy === 'native'

    return combine(
      draggable({
        element,
        dragHandle: handle,
        getInitialData: () => ({ id, draggableData: data }),
        onGenerateDragPreview: ({ nativeSetDragImage }) => {
          if (!hasCustomPreview) {
            // Немає кастомного preview — вимикаємо нативний
            disableNativeDragPreview({ nativeSetDragImage })
            preventUnhandled.start()
            return
          }

          if (useNativeStrategy) {
            // Рендеримо preview через нативний механізм браузера
            setCustomNativeDragPreview({
              nativeSetDragImage,
              getOffset: () => ({ x: 12, y: 12 }),
              render: ({ container: nativeContainer }) => {
                const previewNode =
                  typeof dragPreview === 'function'
                    ? dragPreview({ x: 0, y: 0 })
                    : dragPreview

                const root = createRoot(nativeContainer)
                root.render(previewNode)
                return () => root.unmount()
              },
            })
          } else {
            // follow strategy: preview слідує за курсором через портал —
            // нативний preview вимикаємо
            disableNativeDragPreview({ nativeSetDragImage })
            preventUnhandled.start()
          }
        },
        onDragStart: ({ location }) => {
          setState('dragging')
          onDragStart?.(id)
          setCursorPosition({
            x: location.current.input.clientX,
            y: location.current.input.clientY,
          })
        },
        onDrag: ({ location }) => {
          setCursorPosition({
            x: location.current.input.clientX,
            y: location.current.input.clientY,
          })
        },
        onDrop: () => {
          setState('idle')
          if (!dragPreview || previewStrategy !== 'native') {
            preventUnhandled.stop()
          }
          onDragEnd?.(id)
        },
      }),
      dropTargetForElements({
        element,
        getData: () => ({ id, draggableData: data }),
        canDrop: ({ source }) => source.data.id !== id,
        onDragEnter: () => setIsDraggingOver(true),
        onDragLeave: () => setIsDraggingOver(false),
        onDrop: () => setIsDraggingOver(false),
      })
    )
  }, [ id, disabled, previewStrategy ])

  // Рендер кастомного preview через портал (follow strategy)
  const portalPreview =
    isDragging && dragPreview && previewStrategy === 'follow'
      ? createPortal(
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              pointerEvents: 'none',
              zIndex: 9999,
              transform: `translate(${cursorPosition.x + 12}px, ${cursorPosition.y + 12}px)`,
            }}
          >
            {typeof dragPreview === 'function'
              ? dragPreview(cursorPosition)
              : dragPreview}
          </div>,
          document.body,
        )
      : null

  return (
    <>
      {
        children({
          state,
          isDragging,
          isDraggingOver,
          draggableRef,
          dragHandleRef,
        })
      }
      {
        portalPreview
      }
    </>
  )
}
