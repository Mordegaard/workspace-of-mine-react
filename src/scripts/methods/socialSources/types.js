/**
 * @typedef {('reddit'|'telegram')} SourceType
 */

/**
 * @typedef {object} SocialSource
 * @property {string} key
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
 */

/**
 * @typedef {object} PostLink
 * @property {string} name
 * @property {string} url
 */

/**
 * @typedef {object} PostReaction
 * @property {string} emoji
 * @property {number} count
 */

/**
 * @typedef {object} FormattedPost
 * @property {string} id
 * @property {string} text
 * @property {SourceType} type
 * @property {PostImage[]} images
 * @property {PostLink[]} links
 * @property {string|Date} createdAt
 * @property {string?} url
 * @property {number?} likes
 * @property {PostReaction[]?} reactions
 */