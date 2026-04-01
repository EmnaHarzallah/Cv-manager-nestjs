import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Get()
  findAll() {
    return this.cvService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cvService.findOne(+id);
  }

  @Post()
  create(@Body() createCvDto: CreateCvDto, @Req() req: any) {
    return this.cvService.create(createCvDto, req.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCvDto: UpdateCvDto, @Req() req: any) {
    return this.cvService.update(+id, updateCvDto, req.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.cvService.remove(+id, req.userId);
  }
}
