import Validator, { stringRangeAssertion, emptyValueAssertion } from 'scripts/methods/validator'
import { MAX_BOOKMARK_NAME_LENGTH } from 'scripts/methods/bookmarks/constants'
import Settings from 'scripts/methods/settings'

const BookmarkValidator = new Validator(
  [
    emptyValueAssertion({
      property: 'bookmark.name',
      errorMessage: 'Закладка повинна мати назву'
    }),
    stringRangeAssertion({
      property: 'bookmark.name',
      maxLength: MAX_BOOKMARK_NAME_LENGTH,
      errorMessage: 'Назва закладки занадто довга'
    }),
    stringRangeAssertion({
      property: 'bookmark.url',
      errorMessage: 'Адреса закладки занадто довга'
    }),
    {
      property: 'bookmark.url',
      errorMessage: 'Адреса не є валідним URL',
      callback: url => {
        try {
          return Boolean(new URL(url))
        } catch (e) {
          return false
        }
      }
    },
    {
      property: 'bookmark',
      context: ['bookmarks'],
      errorMessage: 'Неможливо додати більше закладок',
      callback: (bookmark, bookmarks) => {
        const { columns, rows } = Settings.get('bookmarks_grid')
        return !Array.isArray(bookmarks) || bookmarks.length < columns * rows;
      }
    }
  ]
)

export default BookmarkValidator