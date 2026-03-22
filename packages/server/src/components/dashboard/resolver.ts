import { DataSource } from 'typeorm';
import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { Tender } from '../../entities/Tender';
import { Vendor } from '../../entities/Vendor';
import { Ticket } from '../../entities/Ticket';
import { Notification } from '../../entities/Notification';
import { TenderPostAward } from '../../entities/TenderPostAward';

function getDb(): DataSource {
  return getContainer().get<DataSource>(TYPES.DbContext);
}

export const dashboardResolvers = {
  Query: {
    getDashboardSummary: async () => {
      const db = getDb();

      const [totalTenders, totalVendors, totalOpenTickets, unreadNotifications] =
        await Promise.all([
          db.getRepository(Tender).count(),
          db.getRepository(Vendor).count(),
          db
            .getRepository(Ticket)
            .createQueryBuilder('t')
            .where('t.status != :closed', { closed: 'CLOSED' })
            .getCount(),
          db
            .getRepository(Notification)
            .createQueryBuilder('n')
            .where('n.isRead = :v', { v: false })
            .andWhere('n.isDismissed = :d', { d: false })
            .getCount(),
        ]);

      const tendersByStatus = await db
        .getRepository(Tender)
        .createQueryBuilder('t')
        .select('t.status', 'status')
        .addSelect('COUNT(*)::int', 'count')
        .groupBy('t.status')
        .getRawMany();

      const postAwardByStage = await db
        .getRepository(TenderPostAward)
        .createQueryBuilder('pa')
        .select('pa.currentStage', 'stage')
        .addSelect('COUNT(*)::int', 'count')
        .groupBy('pa.currentStage')
        .getRawMany();

      const recentTenders = await db.getRepository(Tender).find({
        order: { createdDate: 'DESC' },
        take: 5,
        relations: ['documents', 'tags'],
      });

      return {
        totalTenders,
        totalVendors,
        totalOpenTickets,
        unreadNotifications,
        tendersByStatus,
        postAwardByStage,
        recentTenders,
      };
    },
  },
};
