import { MigrationInterface, QueryRunner, Table } from 'typeorm'
import { UserRoles, UserStatus } from '../../constants/user.constant'

export class createUsersTable1647514562375 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'email', type: 'varchar', isUnique: true },
          { name: 'username', type: 'varchar' },
          { name: 'password', type: 'varchar', default: null },
          { name: 'phone_number', type: 'varchar' },
          { name: 'company_name', type: 'varchar' },
          { name: 'company_website', type: 'varchar' },
          { name: 'avatar', type: 'varchar', default: null },
          { name: 'role', type: 'int', default: UserRoles.PRE_VALIDATOR },
          { name: 'status', type: 'int', default: UserStatus.CREATED },
          { name: 'verified_at', type: 'int', default: null },
          { name: 'created_at', type: 'int', default: null },
          { name: 'updated_at', type: 'int', default: null }
        ]
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users')
  }
}
