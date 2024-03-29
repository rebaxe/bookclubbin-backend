/**
 * Module for the SearchController.
 *
 * @author Rebecca Axelsson
 * @version 1.0.0
 */

// import createError from 'http-errors'
import axios from 'axios'

/**
 * Encapsulates an image controller.
 */
export class SearchController {
  /**
   * Get searchresult for requested search string and search preferences.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getSearchResult (req, res, next) {
    if (req.query.query) {
      const searchResult = await axios.get('https://www.googleapis.com/books/v1/volumes', {
        params: {
          q: req.query.query,
          key: process.env.API_KEY
        }
      })

      if (searchResult.data.totalItems > 0) {
        const result = searchResult.data.items.map((item) => {
          const bookInfo = {
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors,
            description: item.volumeInfo.description,
            publishedDate: item.volumeInfo.publishedDate,
            pages: item.volumeInfo.pageCount,
            image: item.volumeInfo.imageLinks?.thumbnail,
            googleRating: item.volumeInfo.averageRating,
            googleId: item.id
          }
          return bookInfo
        })
        res.status(200).json(result)
      } else {
        // const noResult = {}
        // res.status(200).json(noResult)
        res.sendStatus(204)
      }
    } else {
      res.status(400).send('The required parameter \'query\' is missing or empty.')
    }
  }
}
