import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Request } from 'express'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { AreaService } from './area.service'
import { CreateAreaDto } from './dto/createArea.dto'
import { Area } from '../../schemas/area'
import { JwtAuthGuard } from '../../guards/jwtAuth.guard'
import { Account } from '../../schemas/account'

@Controller('area')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiTags('Area')
  @ApiOperation({ summary: 'Create area' })
  @ApiResponse({ type: Area, status: 201 })
  @Post('/create')
  async createArea(
    @Req() req: Request,
    @Body() createAreaDto: CreateAreaDto
  ): Promise<Area | Observable<never>> {
    const account = req.user as Account
    return this.areaService.create(account._id, createAreaDto)
  }
}
