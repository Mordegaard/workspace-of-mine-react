import AbstractPostsController from 'scripts/methods/social/posts/AbstractPostsController'
import { MEDIA_IMAGE, SOURCE_TUMBLR, TUMBLR_BASE } from 'scripts/methods/social/constants'
import NotificationManager from 'scripts/methods/notificationManager'
import CacheManager from 'scripts/methods/cache'

export default class TumblrPostsController extends AbstractPostsController {
  constructor (controller) {
    super(controller)

    this.type   = SOURCE_TUMBLR
    this.url    = TUMBLR_BASE
    this.afters = {}
    this.defaultOptions = {
      api_key: process.env.TUMBLR_API_KEY,
      npf: true
    }
  }

  /**
   * @param post
   * @return {PostMedia[]}
   */
  getMedia (post) {
    const media = post.content.filter(({ type }) => type === 'image')

    return media.map(item => ({
      width: item.media[0].width,
      height: item.media[0].height,
      type: MEDIA_IMAGE,
      hidden: false,
      data: {
        url: item.media[0].url,
        thumbnail: item.media[1].url
      }
    }))
  }

  async formatPost (post, source) {
    /** @type {PostLink[]} links */
    const links = [
      {
        url: post.blog.url,
        name: post.blog.name,
        type: 'user'
      },
      {
        url: source.url,
        name: post.blog.title,
        type: 'source'
      }
    ]

    const title = post.summary?.trim() || 'Без заголовку'
    const text = post.content.filter(({ type }) => type === 'text').map(({ text }) => text).join('\n')

    return {
      originalPost: post,
      id: post.id_string,
      type: this.type,
      createdAt: new Date(post.timestamp * 1000),
      source: source,
      text: title !== text ? text : null,
      media: this.getMedia(post),
      url: post.post_url,
      likes: post.note_count,
      tags: post.tags,
      title,
      links
    }
  }

  async getPostsBySource (sourceKey, options = {}) {
    try {
      let response

      const params = {
        limit: await this.getPerPage(),
        ...options
      }

      if (this.afters[sourceKey]) {
        params.offset = this.afters[sourceKey]
      } else {
        response = await CacheManager.get(`posts/tumblr/${sourceKey}`, CacheManager.TYPE_JSON)
      }

      if (!response) {
        ({ response } = await super.get(`blog/${sourceKey}/posts`, params))

        if (!this.afters[sourceKey]) {
          await CacheManager.put(`posts/tumblr/${sourceKey}`, response, this.controller.cacheTTL)
        }
      }

      const { posts } = response
      const source = await this.getSource(sourceKey)

      this.afters[sourceKey] = (this.afters[sourceKey] ?? 0) + posts.length

      const formattedPosts = await Promise.all(posts.map(data => this.formatPost(data, source)))

      this.controller.appendPosts(formattedPosts)

      return { posts, formattedPosts }
    } catch (e) {
      console.error(e)
      NotificationManager.notify(`Помилка при отриманні постів з tumblr-акаунта ${sourceKey}`, NotificationManager.TYPE_ERROR)
    }
  }
}