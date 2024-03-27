import {Sequelize} from 'sequelize'

import {SequelizeRepositories} from '../infrastructure/repositories/sequelize/SequelizeRepositories'
import {User} from "cinetex-core/dist/domain/entities/User";

const sequelize = new Sequelize("oracle://cinetex:goodExample@localhost:1521/xe")
const repositories = new SequelizeRepositories(sequelize)
const userRepository = repositories.User

beforeAll(async () => {
    // await sequelize.sync()
})

describe('Test Sequelize', () => {

    it('should create a user', async () => {
        // const user: User = {
        //     id: "65f269ff62a11600a56e4be7",
        //     email: 'peter.smith@centennial.ca',
        //     password: 'password0',
        //     emailVerified: false,
        //     firstName: 'Peter',
        //     lastName: 'Smith',
        //     phoneNumber: '567-890-1234',
        //     roles: ["admin", "user"],
        // }
        // const user2 = await userRepository.createUser(user)
        // console.log(user2)

    })

})
