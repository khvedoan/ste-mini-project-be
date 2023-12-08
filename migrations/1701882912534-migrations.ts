import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1701882912534 implements MigrationInterface {
  name = 'Migrations1701882912534';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`data_record\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`postId\` int NOT NULL, \`recordId\` int NOT NULL, \`name\` varchar(250) NOT NULL, \`email\` varchar(250) NOT NULL, \`body\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`data_record\``);
  }
}
