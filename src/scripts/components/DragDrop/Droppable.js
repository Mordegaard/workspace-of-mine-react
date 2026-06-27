import { useEffect, useRef, useState } from 'react'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'

/**
 * Компонент Droppable.
 *
 * Підтримує вертикальні, горизонтальні списки та сітку.
 * Використовує render prop патерн — ви повністю контролюєте розмітку.
 * Прикріпіть `droppableRef` до вузла-контейнера.
 *
 * Props:
 * @param {string}   id                      — унікальний ідентифікатор зони
 * @param {'list'|'grid'} [orientation='list']
 *                                           — орієнтація списку або сітка
 * @param {Function} [canDrop]               — (dragData) => boolean предикат дозволу скидання
 * @param {Function} children                — render prop: (renderProps) => ReactNode
 * @param {Function} [onDragEnter]           — (dragData) => void
 * @param {Function} [onDragLeave]           — (dragData) => void
 * @param {Function} [onDrop]                — (dragData, dropTargetId, position) => void
 *
 * Render prop отримує:
 * @yields {string}    state          — 'idle' | 'drag-over-allowed' | 'drag-over-forbidden'
 * @yields {boolean}   isDragOver     — чи є елемент над зоною
 * @yields {boolean}   isAllowed      — чи дозволено скидання
 * @yields {string}    orientation    — передана орієнтація
 * @yields {RefObject} droppableRef   — прикріпити до контейнера
 *
 *
 * @example Вертикальний список
 * <Droppable id="list-1" orientation="list" onDrop={handleDrop}>
 *   {({ droppableRef, isDragOver, isAllowed }) => (
 *     <StyledList ref={droppableRef} $isDragOver={isDragOver} $isAllowed={isAllowed}>
 *       {items.map(item => <Item key={item.id} {...item} />)}
 *     </StyledList>
 *   )}
 * </Droppable>
 *
 *
 * @example Сітка
 * <Droppable id="grid-1" orientation="grid" onDrop={handleDrop}>
 *   {({ droppableRef }) => (
 *     <StyledGrid ref={droppableRef}>
 *       {cells.map(cell => (
 *         <StyledCell key={cell.id}>
 *           {cell.content}
 *         </StyledCell>
 *       ))}
 *     </StyledGrid>
 *   )}
 * </Droppable>
 *
 * @example З обмеженням типу елементів
 * <Droppable
 *   id="cards-only"
 *   canDrop={(dragData) => dragData.type === 'card'}
 *   onDrop={handleDrop}
 * >
 *   {({ droppableRef, isDragOver, isAllowed, state }) => (
 *     <StyledList ref={droppableRef} $state={state}>
 *       ...
 *     </StyledList>
 *   )}
 * </Droppable>
 */
export function Droppable ({
  id,
  orientation = 'list',
  canDrop,
  children,
  onDragEnter,
  onDragLeave,
  onDrop,
}) {
  const droppableRef = useRef(null)

  const [ state, setState ] = useState('idle')

  useEffect(() => {
    const element = droppableRef.current

    if (!element) return

    return dropTargetForElements({
      element,
      canDrop: ({ source }) => {
        if (canDrop == null) return true

        return canDrop(source.data)
      },
      onDragEnter: ({ source }) => {
        const allowed = !canDrop || canDrop(source.data)

        setState(allowed ? 'drag-over-allowed' : 'drag-over-forbidden')
        onDragEnter?.(source.data)
      },
      onDragLeave: ({ source }) => {
        setState('idle')
        onDragLeave?.(source.data)
      },
      onDrop: ({ source, location }) => {
        setState('idle')

        if (typeof onDrop !== 'function') return

        onDrop({ id, source, destination: location.current.dropTargets[0] })
      },
    })
  }, [ id, orientation, onDrop ])
  // Навмисно не включаємо колбеки до залежностей — щоб не перереєстровувати
  // drop target на кожен ре-рендер. Загорніть їх у useRef, якщо потрібна
  // реактивність.

  const isDragOver = state !== 'idle'
  const isAllowed = state === 'drag-over-allowed'

  return children({
    state,
    isDragOver,
    isAllowed,
    orientation,
    droppableRef,
  })
}
