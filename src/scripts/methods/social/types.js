/**
 * @typedef {'reddit'|'telegram'} SourceType
 */

/**
 * @typedef {object} SocialSource
 * @property {string} key
 * @property {string} name
 * @property {boolean} hidden
 * @property {SourceType} type
 * @property {string} [description]
 * @property {string} [profile_picture]
 */

/**
 * @typedef {object} RedditMediaData
 * @property {string} url
 * @property {string} thumbnail
 */

/**
 * @typedef {object} TelegramMediaData
 * @property {object} [photo]
 * @property {object} [document]
 * @property {object} [webpage]
 */

/**
 * @typedef {object} PostMedia
 * @property {'photo'|'video'|'embed'} type
 * @property {RedditMediaData|TelegramMediaData} data
 * @property {number} [width]
 * @property {number} [height]
 * @property {number} [duration]
 * @property {number} [size]
 * @property {boolean} [hidden]
 */

/**
 * @typedef {object} PostComment
 * @property {string} id
 * @property {SourceType} type
 * @property {string} author
 * @property {string|Date} createdAt
 * @property {string|React.ReactElement} [text]
 * @property {string} [replyTo]
 * @property {PostMedia[]} [media]
 * @property {number} [likes]
 * @property {PostReaction[]} [reactions]
 */

/**
 * @typedef {object} PostLink
 * @property {string} type
 * @property {string} name
 * @property {string} [url]
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
 * @property {SocialSource} source
 * @property {string|React.ReactElement} [text]
 * @property {PostLink[]} [links]
 * @property {PostMedia[]} [media]
 * @property {string} [url]
 * @property {number} [likes]
 * @property {number} [comments]
 * @property {PostReaction[]} [reactions]
 */