import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { CreateDebtRecordDto } from './dto/create-debt.dto';
import type { SmsGateway } from '../shared/interfaces/sms-gateway.interface';
import { Customer } from '../entities/customer.entity';
import { DebtLedger } from '../entities/debt-ledger.entity';

@Injectable()
export class ClientManagementService {
  private readonly logger = new Logger(ClientManagementService.name);

  constructor(
    @Inject('SMS_GATEWAY') private readonly smsGateway: SmsGateway,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(DebtLedger)
    private readonly debtRepository: Repository<DebtLedger>,
  ) { }

  /**
   * Creates a new debt record and updates the customer's total debt.
   *
   * @param createDebtDto - The debt record data
   * @param manager - Optional EntityManager for transactions
   * @returns The created debt record
   */
  async createDebtRecord(
    createDebtDto: CreateDebtRecordDto,
    manager?: EntityManager,
  ): Promise<any> {
    this.logger.log(
      `Creating debt record for customer ${createDebtDto.customerId}`,
    );

    const customerRepo = manager
      ? manager.getRepository(Customer)
      : this.customerRepository;
    const debtRepo = manager
      ? manager.getRepository(DebtLedger)
      : this.debtRepository;

    // 1. Verify customer exists and belongs to the merchant
    const customer = await customerRepo.findOne({
      where: {
        id: createDebtDto.customerId,
        merchant_id: createDebtDto.merchantId,
      },
    });
    if (!customer) {
      throw new NotFoundException(
        `Customer with ID ${createDebtDto.customerId} not found`,
      );
    }

    // 2. Save the debt ledger entry
    const debtRecord = await debtRepo.save({
      customer_id: createDebtDto.customerId,
      sale_id: createDebtDto.saleId,
      amount_due: createDebtDto.amountDue,
      due_date: createDebtDto.dueDate,
      status: 'PENDING',
      created_at: new Date(),
    });

    // 3. Update the customer's total debt
    const newTotal =
      (Number(customer.total_debt) || 0) + createDebtDto.amountDue;
    await customerRepo.update(customer.id, { total_debt: newTotal });

    this.logger.log(
      `Debt record created successfully. New total debt: ${newTotal}`,
    );

    return {
      success: true,
      debtRecord,
      customerTotalDebt: newTotal,
    };
  }

  /**
   * Sends an SMS reminder to a customer about their outstanding debt.
   *
   * @param customerId - The customer's ID
   * @param shopName - The name of the shop
   * @returns Success message
   */
  async sendSmsReminder(
    customerId: string,
    shopName: string,
  ): Promise<{ success: boolean; message: string }> {
    this.logger.log(`Sending SMS reminder to customer ${customerId}`);

    // 1. Fetch customer details
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    if (customer.total_debt <= 0) {
      return {
        success: false,
        message: 'Customer has no outstanding debt.',
      };
    }

    // 2. Construct the message
    // "Hello [Name], kindly pay your balance of [Amount] at [Shop Name]."
    const message = `Hello ${customer.name}, kindly pay your balance of ${customer.total_debt} RWF at ${shopName}.`;

    // 3. Send via Generic SMS Gateway
    const sent = await this.smsGateway.sendSms(customer.phone, message);

    if (sent) {
      this.logger.log(`SMS reminder sent successfully to ${customer.phone}`);
      return {
        success: true,
        message: 'SMS reminder sent successfully.',
      };
    } else {
      this.logger.error(`Failed to send SMS to ${customer.phone}`);
      return {
        success: false,
        message: 'Failed to send SMS.',
      };
    }
  }
  /**
   * Retrieves all customers for a specific merchant.
   *
   * @param merchantId - The ID of the merchant
   * @returns List of customers for the merchant
   */
  async findAllCustomers(merchantId: string): Promise<Customer[]> {
    return this.customerRepository.find({
      where: { merchant_id: merchantId },
      order: { name: 'ASC' },
    });
  }

  /**
   * Creates a new customer.
   *
   * @param customerData - The customer data
   * @returns The created customer
   */
  async createCustomer(customerData: Partial<Customer>): Promise<Customer> {
    this.logger.log(`Creating new customer: ${customerData.name}`);
    const newCustomer = this.customerRepository.create(customerData);
    return this.customerRepository.save(newCustomer);
  }

  /**
   * Cancels a debt record and updates the customer's total debt.
   *
   * @param saleId - The ID of the sale being refunded
   * @param manager - Optional EntityManager for transactions
   */
  async cancelDebt(saleId: string, manager?: EntityManager): Promise<void> {
    this.logger.log(`Cancelling debt for sale ${saleId}`);

    const customerRepo = manager
      ? manager.getRepository(Customer)
      : this.customerRepository;
    const debtRepo = manager
      ? manager.getRepository(DebtLedger)
      : this.debtRepository;

    // 1. Find the debt record
    const debtRecord = await debtRepo.findOne({
      where: { sale_id: saleId },
    });

    if (!debtRecord) {
      this.logger.warn(`No debt record found for sale ${saleId}`);
      return;
    }

    if (debtRecord.status === 'CANCELLED' || debtRecord.status === 'PAID') {
      this.logger.warn(
        `Debt record for sale ${saleId} is already ${debtRecord.status}`,
      );
      return;
    }

    // 2. Update debt status
    debtRecord.status = 'CANCELLED';
    await debtRepo.save(debtRecord);

    // 3. Update customer total debt
    const customer = await customerRepo.findOne({
      where: { id: debtRecord.customer_id },
    });

    if (customer) {
      const newTotal = Math.max(
        0,
        Number(customer.total_debt) - Number(debtRecord.amount_due),
      );
      await customerRepo.update(customer.id, { total_debt: newTotal });
      this.logger.log(`Customer ${customer.id} debt reduced to ${newTotal}`);
    }
  }
}
