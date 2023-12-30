import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

//TODO 'active','assay','frozen','deleted'
// Pending: Пользователь только что зарегистрировался и еще не прошел проверку.
// Banned: Пользователь был заблокирован за нарушение правил системы.
// Suspended: Пользователь был временно приостановлен за нарушение правил системы.
// Unconfirmed: Пользователь не подтвердил свою учетную запись.
// New: Пользователь только что зарегистрировался.
// Pro: Пользователь имеет платную подписку.
// VIP: Пользователь имеет особый статус или привилегии.
// Admin: Пользователь является администратором системы.
// Guest: Пользователь не имеет учетной записи, но может просматривать и взаимодействовать с некоторыми функциями системы.
async function main() {
  const status = await prisma.status.createMany({
    data: [
      {
        name: 'Pending',
        description: 'User just registered and has not been verified yet.',
      },
      {
        name: 'Banned',
        description: 'User has been banned for violating system rules.',
      },
      {
        name: 'Suspended',
        description:
          'User has been temporarily suspended for violating system rules.',
      },
      // Add more status records as needed
    ],
  });

  const role = await prisma.role.createMany({
    data: [
      {
        name: 'Admin',
        slug: 'admin',
      },
      {
        name: 'Project Manager',
        slug: 'project-manager',
      },
      {
        name: 'Manager',
        slug: 'manager',
      },
      {
        name: 'User',
        slug: 'user',
      },
      {
        name: 'Guest',
        slug: 'guest',
      },
      // Add more status records as needed
    ],
  });

  const permission = await prisma.permission.createMany({
    data: [
      {
        name: 'User list',
        slug: 'user-list',
      },
      {
        name: 'User create',
        slug: 'user-create',
      },
      {
        name: 'User edit',
        slug: 'user-edit',
      },
      {
        name: 'User delete',
        slug: 'user-delete',
      },
      // Add more status records as needed
    ],
  });

  const blocklistIp = await prisma.blocklistIp.createMany({
    data: [
      {
        start_ip: '102.38.250.0',
        end_ip: '102.38.252.255',
      },
      {
        start_ip: '103.113.68.0',
        end_ip: '103.113.68.255',
      },
      {
        start_ip: '::1',
        end_ip: '::1',
      },
      // Add more status records as needed
    ],
  });

  console.log({ status, role, permission, blocklistIp });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
