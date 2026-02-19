import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, name, role, phone, address } = createUserDto;

    const existing = await this.userModel.findOne({ email });
    if (existing) throw new BadRequestException('Email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      phone,
      address,
    });

    return user.toObject();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().lean();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).lean();
  }

  // Find user by ID
  async findById(id: string) {
    return this.userModel.findById(id).lean();
  }

  // Update user
  async update(id: string, data: Partial<CreateUserDto>) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.userModel.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  // Delete user
  async remove(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
