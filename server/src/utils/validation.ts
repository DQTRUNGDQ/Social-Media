import express from 'express'
import { body, validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import { ErrorWithStatus } from '~/models/Errors'

// can be reused by many routes
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validation.run(req)
    const errors = validationResult(req)
    const errorsObject = errors.mapped()
    for (const key in errorsObject) {
      const { msg } = errorsObject[key]
      if (msg instanceof ErrorWithStatus && msg.status) {
        errorsObject[key] = errorsObject[key].msg
      }
    }
    console.log(errorsObject)
    // Nếu mà không có lỗi thì next
    if (errors.isEmpty()) {
      return next()
    }
    res.status(400).json({ errors: errorsObject })
  }
}
