import AbstractPostsController from 'scripts/methods/social/posts/AbstractPostsController'
import { BLUESKY_BASE, MEDIA_IMAGE, SOURCE_BLUESKY } from 'scripts/methods/social/constants'
import NotificationManager from 'scripts/methods/notificationManager'
import CacheManager from 'scripts/methods/cache'

export default class BlueskyPostsController extends AbstractPostsController {
  constructor (controller) {
    super(controller)

    this.type   = SOURCE_BLUESKY
    this.url    = BLUESKY_BASE
    this.afters = {}
  }

  /**
   * @param post
   * @return {PostMedia[]}
   */
  getMedia (post) {
    if (!post.embed?.images) return []

    return post.embed.images.map(item => ({
      width: item.aspectRatio.width,
      height: item.aspectRatio.height,
      type: MEDIA_IMAGE,
      hidden: false,
      data: {
        url: item.fullsize,
        thumbnail: item.thumb
      }
    }))
  }

  async formatPost (post, source) {
    /** @type {PostLink[]} links */
    const links = [
      {
        url: `https://bsky.app/profile/${post.author.handle}`,
        name: post.author.displayName,
        type: 'user'
      },
      {
        url: `https://bsky.app/profile/${post.author.handle}`,
        name: post.author.handle,
        type: 'source'
      }
    ]

    const text = post.record.text
    const postId = post.uri.match(/app\.bsky\.feed\.post\/(?<id>.+)/).groups.id

    return {
      originalPost: post,
      id: post.uri,
      type: this.type,
      createdAt: new Date(post.record.createdAt),
      source: source,
      text: text,
      media: this.getMedia(post),
      url: `https://bsky.app/profile/${post.author.handle}/post/${postId}`,
      likes: post.likeCount,
      tags: post.tags,
      comments: post.replyCount,
      links
    }
  }

  async getPostsBySource (sourceKey, options = {}) {
    try {
      let response

      const params = {
        actor: sourceKey,
        limit: await this.getPerPage(),
        filter: 'posts_and_author_threads',
        includePins: 'true',
        ...options
      }

      if (this.afters[sourceKey]) {
        params.cursor = this.afters[sourceKey]
      } else {
        response = await CacheManager.get(`posts/bluesky/${sourceKey}`, CacheManager.TYPE_JSON)
      }

      if (!response) {
        response = await super.get(`app.bsky.feed.getAuthorFeed`, params)

        if (!this.afters[sourceKey]) {
          await CacheManager.put(`posts/bluesky/${sourceKey}`, response, this.controller.cacheTTL)
        }
      }

      const { feed, cursor } = response
      const source = await this.getSource(sourceKey)

      this.afters[sourceKey] = cursor

      const formattedPosts = await Promise.all(feed.map(({ post }) => this.formatPost(post, source)))

      this.controller.appendPosts(formattedPosts)

      return { posts: feed, formattedPosts }
    } catch (e) {
      console.error(e)
      NotificationManager.notify(`Помилка при отриманні постів з bluesky-акаунта ${sourceKey}`, NotificationManager.TYPE_ERROR)
    }
  }

  async getPostsById (ids = [], source) {
    try {
      let posts = []
      const uncachedIds = ids.slice()

      for (const id of ids) {
        const post = await CacheManager.get(`posts/show_many/${this.type}/${id}`, CacheManager.TYPE_JSON)

        if (post) {
          posts.push(post)
          uncachedIds.splice(uncachedIds.indexOf(id), 1)
        }
      }

      if (uncachedIds.length > 0) {
        const searchParams = new URLSearchParams()

        uncachedIds.forEach(id => searchParams.append('uris', id))

        const { posts: fetchedPosts } = await super.get('app.bsky.feed.getPosts', searchParams)

        for (const post of fetchedPosts) {
          await CacheManager.put(`posts/show_many/${this.type}/${post.id}`, post, this.controller.cacheTTL)
        }

        posts.push(...fetchedPosts)
      }

      const formattedPosts = await Promise.all(
        posts.map(data => this.formatPost(data, source))
      )

      return formattedPosts
    } catch (e) {
      console.error(e)
      NotificationManager.notify(`Помилка при отриманні постів`, NotificationManager.TYPE_ERROR)
    }
  }
}