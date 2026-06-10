import { PartialType } from '@nestjs/swagger';

import { CreateHealthEventDto } from './create-health-event.dto.js';

export class UpdateHealthEventDto extends PartialType(CreateHealthEventDto) {}
