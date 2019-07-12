import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IncomeCreateCommand } from '../income.create.command';
import { IncomeService } from '../../income.service';
import { Income } from '../../income.entity';
import { EmployeeService } from '../../../employee/employee.service';
import { OrganizationService } from '../../../organization';

@CommandHandler(IncomeCreateCommand)
export class IncomeCreateHandler implements ICommandHandler<IncomeCreateCommand> {
    constructor(
        private readonly incomeService: IncomeService,
        private readonly employeeService: EmployeeService,
        private readonly organizationService: OrganizationService,
    ) { }

    public async execute(command: IncomeCreateCommand): Promise<Income> {
        const { input } = command;

        const income = new Income();
        const employee = await this.employeeService.findOne(input.employeeId);
        const organization = await this.organizationService.findOne(employee.orgId);

        income.clientName = input.clientName;
        income.clientId = input.clientId;
        income.employee = employee;
        income.organization = organization;
        income.amount = input.amount;
        income.valueDate = input.valueDate;

        return await this.incomeService.create(income);
    }
}