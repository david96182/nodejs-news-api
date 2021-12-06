import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { User, UserDoc } from './schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtPayload } from './jwt-payload.interface';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly user_model: Model<UserDoc>,
        private jwtService: JwtService) {}

    async signUp(signUpDto: SignUpDto): Promise<{msg: String}> {
        const { username, password } = signUpDto;
        
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const createdUser = new this.user_model({username,password: hashedPassword});

        try {
            await createdUser.save();
          } catch (error) {
            if (error.code === '23505') {
              // duplicate username
              throw new ConflictException('Username already exists');
            } else {
              throw new InternalServerErrorException();
            }
          }

        return { msg: "Sign Up successfull"};
      }
    
      async signIn(
        signInDto: SignInDto,
      ): Promise<{ accessToken: string }> {
        const { username, password } = signInDto;
        
        const user = await this.user_model.findOne({ username });
        
        if (user && (await bcrypt.compare(password, user.password))) {
          const payload: JwtPayload = { username };
          const accessToken: string = await this.jwtService.sign(payload);
          return { accessToken };
        } else {
          throw new UnauthorizedException('Please check your login credentials');
        }
      }
}
