import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0'
import { table } from '../utils/Airtable'

const ownsRecord = (handler) =>
  withPageAuthRequired(async (req, res) => {
    const { user } = getSession(req, res)
    const { id } = req.body

    try {
      const existingRecord = await table.find(id)

      if (!existingRecord || user.sub !== existingRecord.fields.userId) {
        res.statusCode = 404
        return res.json({ msg: 'Record not found' })
      }

      req.record = existingRecord
      return handler(req, res)
    } catch (error) {
      console.error(err)
      res.statusCode = 500
      return res.json({ msg: 'Something went wrong' })
    }
  })

export default ownsRecord