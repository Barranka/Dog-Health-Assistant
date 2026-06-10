import { PartialType } from '@nestjs/swagger';

import { CreateDogDto } from './create-dog.dto.js';

export class UpdateDogDto extends PartialType(CreateDogDto) {}
