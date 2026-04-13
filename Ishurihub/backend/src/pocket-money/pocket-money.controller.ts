import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PocketMoneyService } from './pocket-money.service';
import {
  CreatePocketMoneyAccountDto,
  DepositDto,
  WithdrawDto,
  UpdateLimitDto,
} from './dto/pocket-money.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('pocket-money')
@UseGuards(JwtAuthGuard)
export class PocketMoneyController {
  constructor(private readonly pocketMoneyService: PocketMoneyService) {}

  // Create wallet for a student
  @Post('accounts')
  createAccount(@Body() dto: CreatePocketMoneyAccountDto) {
    return this.pocketMoneyService.createAccount(dto);
  }

  // Get all wallets for a school
  @Get('accounts')
  getAllAccounts(@Query('schoolId') schoolId: string) {
    return this.pocketMoneyService.getAllAccounts(schoolId);
  }

  // School-level financial summary
  @Get('summary')
  getSchoolSummary(@Query('schoolId') schoolId: string) {
    return this.pocketMoneyService.getSchoolSummary(schoolId);
  }

  // Get specific student wallet
  @Get('accounts/student/:studentId')
  getAccountByStudent(@Param('studentId') studentId: string) {
    return this.pocketMoneyService.getAccountByStudent(studentId);
  }

  // Update daily spending limit for student
  @Patch('accounts/student/:studentId/limit')
  updateLimit(
    @Param('studentId') studentId: string,
    @Body() dto: UpdateLimitDto,
  ) {
    return this.pocketMoneyService.updateLimit(studentId, dto);
  }

  // Deposit money into student wallet
  @Post('deposit')
  deposit(@Body() dto: DepositDto, @Request() req: any) {
    return this.pocketMoneyService.deposit({
      ...dto,
      performedBy: dto.performedBy || req.user?.userId,
    });
  }

  // Withdraw money from student wallet
  @Post('withdraw')
  withdraw(@Body() dto: WithdrawDto, @Request() req: any) {
    return this.pocketMoneyService.withdraw({
      ...dto,
      performedBy: dto.performedBy || req.user?.userId,
    });
  }

  // Get all transactions for a school (optionally filter by student)
  @Get('transactions')
  getTransactions(
    @Query('schoolId') schoolId: string,
    @Query('studentId') studentId?: string,
  ) {
    return this.pocketMoneyService.getTransactions(schoolId, studentId);
  }

  // Get full wallet + transaction history for a student
  @Get('student/:studentId')
  getStudentHistory(@Param('studentId') studentId: string) {
    return this.pocketMoneyService.getStudentTransactions(studentId);
  }
}
