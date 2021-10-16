import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Query } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchResponse } from './match-response';

@ApiTags('Server')
@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  /*
Creates a match data for the user.
*/
  @Post()
  createMatch(
    @Query('id') id: string,
    @Query('difficulty') difficulty: string,
    @Query('language') language: string
  ): string {
    return this.matchService.createMatch(id, difficulty, language);
  }

  /*
  Gets a match for a user if there is a matching user
   */
  @Get()
  async getMatch(
    @Query('id') id: string,
    @Query('difficulty') difficulty: string,
    @Query('language') language: string
  ): Promise<MatchResponse> {
    return this.matchService.getMatch(id, difficulty, language);
  }
}
