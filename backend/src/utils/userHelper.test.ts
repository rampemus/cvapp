import { randomPassword, randomUserName } from './userHelper'
import { LoginRequestSchema } from './validators'

describe('Generated usernames and passwords are valid', () => {
  test('with validator', async () => {
    const validUsers: any = []
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < 60; i++) {
      validUsers.push({ username: randomUserName(), password: randomPassword(Math.round(Math.random() * 10 + 10))})
    }

    for (const user of validUsers) {
      const validationResult = LoginRequestSchema.validate(user)

      expect(validationResult.error).toBeUndefined()
    }
  })
})
