import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('Auth Service', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    //create a fake copy of the users service
    const users: User[] = [];

    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates new user with salted and hashed password ', async () => {
    const user = await service.singUp('test@asdf.com', 'qwerty');

    expect(user.password).not.toEqual('qwerty');
    const [salt, hash] = user.password.split('.');
    expect(hash).toBeDefined();
    expect(salt).toBeDefined();
  });

  it('throws an error if user signs up with existing email', async () => {
    await service.singUp('asdf@asdf.com', 'qwerty');

    await expect(service.singUp('asdf@asdf.com', 'qwerty')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws an error if user sings in with existing email', async () => {
    await expect(service.signIn('asdf@asdf.com', 'qwerty')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws if an invalid password is provided', async () => {
    await service.singUp('asdf@asdf.com', 'qwerty1');

    await expect(service.signIn('asdf@asdf.com', 'qwerty')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('return a user if correct password is provided', async () => {
    await service.singUp('asdf@asdf.com', 'qwerty');
    const user = await service.signIn('asdf@asdf.com', 'qwerty');
    expect(user).toBeDefined();
  });
});
