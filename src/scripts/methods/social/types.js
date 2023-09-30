/**
 * @typedef {'reddit'|'telegram'} SourceType
 */

/**
 * @typedef {object} SocialSource
 * @property {string} key
 * @property {string} name
 * @property {boolean} hidden
 * @property {SourceType} type
 * @property {string?} description
 * @property {string?} profile_picture
 */

/**
 * @typedef {object} PostMedia
 * @property {'photo'|'video'} type
 * @property {string|object} url
 * @property {string?} fullSizeUrl
 * @property {number?} width
 * @property {number?} height
 * @property {number?} duration
 * @property {number?} size
 * @property {boolean?} hidden
 */

/**
 * @typedef {object} PostComment
 * @property {string} id
 * @property {string} author
 * @property {string|Date} createdAt
 * @property {(string|React.ReactElement)?} text
 * @property {string?} replyTo
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
 * @property {string|Date} createdAt
 * @property {(string|React.ReactElement)?} text
 * @property {SocialSource} source
 * @property {PostLink[]?} links
 * @property {PostMedia[]?} media
 * @property {string?} url
 * @property {number?} likes
 * @property {number?} comments
 * @property {PostReaction[]?} reactions
 */