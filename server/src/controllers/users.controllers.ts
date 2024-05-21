import { Request, Response } from 'express'
import User from '~/models/schemas/User.schema'
import { ParamsDictionary } from 'express-serve-static-core'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
import { RegisterReqBody } from '~/models/requests/User.requests'

export const loginController = (req: Request, res: Response) => {
  res.json({
    message: 'Đăng ký thành công'
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  try {
    const result = await usersService.register(req.body)
    return res.status(200).json({
      message: 'Đăng ký thành công',
      result
    })
  } catch (error) {
    return res.status(400).json({
      error: 'Đăng ký thất bại'
    })
  }
}
