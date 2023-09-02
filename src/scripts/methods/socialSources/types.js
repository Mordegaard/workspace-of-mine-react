/**
 * @typedef {('reddit'|'telegram')} SourceType
 */

/**
 * @typedef {object} SocialSource
 * @property {string} key
 * @property {string} name
 * @property {SourceType} type
 * @property {string?} description
 * @property {boolean} hidden
 */

/**
 * @typedef {object} PostImage
 * @property {string} url
 * @property {string?} fullSizeUrl
 * @property {number?} width
 * @property {number?} height
 * @property {boolean?} hidden
 */

/**
 * @typedef {object} PostLink
 * @property {string} type
 * @property {string} name
 * @property {string?} url
 */

/**
 * @typedef {object} PostReaction
 * @property {string} emoji
 * @property {number} count
 */

/**
 * @typedef {object} FormattedPost
 * @property {string} id
 * @property {string|React.ReactElement} title
 * @property {SourceType} type
 * @property {PostImage[]} images
 * @property {PostLink[]} links
 * @property {string|Date} createdAt
 * @property {string|React.ReactElement|undefined} text
 * @property {string?} url
 * @property {number?} likes
 * @property {PostReaction[]?} reactions
 */