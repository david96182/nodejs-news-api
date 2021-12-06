import { IsNumberString, IsMongoId } from 'class-validator';

class FindOneParams {
  @IsMongoId()
  id: string;
}

export default FindOneParams