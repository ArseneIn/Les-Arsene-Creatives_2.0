import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { IntakeService } from './intake.service';
import { CreateIntakeDto } from './dto/create-intake.dto';
import { UpdateIntakeDto } from './dto/update-intake.dto';

@Controller('intake')
export class IntakeController {
  constructor(private readonly intakeService: IntakeService) {}

  @Post()
  create(@Body() createIntakeDto: CreateIntakeDto) {
    return this.intakeService.create(createIntakeDto);
  }

  @Get()
  findAll(@Query('institutionId') institutionId?: string) {
    return this.intakeService.findAll(institutionId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.intakeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIntakeDto: UpdateIntakeDto) {
    return this.intakeService.update(id, updateIntakeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.intakeService.remove(id);
  }
}
