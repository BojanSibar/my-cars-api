import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'qwerty' } as User]);
      },
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'qwerty',
        } as User);
      },
      // remove: (id) => {},
      // update: (id, attrs) => {},
    };

    fakeAuthService = {
      signIn: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
      // singUp: (email, password) => {},
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('test@test.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toBe('test@test.com');
  });

  it('findOne return user with given email', async () => {
    const user = await controller.findUser('12');
    expect(user).toBeDefined();
  });

  it('findOne throws an error when given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('2')).rejects.toThrow(NotFoundException);
  });

  it('login updates session object and returns user', async () => {
    const session = { userId: -9 };
    const user = await controller.login(
      { email: 'test@test.com', password: 'qwerty' },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
