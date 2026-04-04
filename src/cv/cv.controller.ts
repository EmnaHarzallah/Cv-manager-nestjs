import { Controller, Get, Post, Body, Patch, 
         Param, Delete, Req, UseGuards } from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  // Admin → tous les CVs / User → ses CVs
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req) {
    const { userId, role } = req.user;
    if (role === 'admin') {
      return this.cvService.findAll();
    }
    return this.cvService.findByUser(userId);
  }

  // Accessible à tous
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cvService.findOne(+id);
  }

  // Connecté requis
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCvDto: CreateCvDto, @Req() req) {
    return this.cvService.create(createCvDto, req.user.userId);
  }

  // Connecté + propriétaire requis
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, 
         @Body() updateCvDto: UpdateCvDto, 
         @Req() req) {
    return this.cvService.update(+id, updateCvDto, req.user.userId);
  }

  // Connecté + propriétaire requis
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.cvService.remove(+id, req.user.userId);
  }

  // Admin uniquement
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/all')
  findAllAdmin() {
    return this.cvService.findAll();
  }
}
