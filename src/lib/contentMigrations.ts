import type { BasePayload } from 'payload';

/**
 * Changes to how existing content is stored. Each one checks whether it's needed and does nothing
 * otherwise, so they run automatically: when the app starts (onInit in payload.config.ts) and after a
 * seed (an older backup gets upgraded). Add new ones to the list at the bottom.
 */

/**
 * The API reference used to group endpoints by function (services). Creates an API category for
 * every function (same id, name, address, description and icon) and moves each endpoint from
 * `service` to `category`.
 */
const apiCategories = async (payload: BasePayload) => {
  // Raw database access: endpoints may still have the old `service` field, which isn't in the schema
  const db = payload.db.connection.db!;
  const pending = await db.collection('endpoints').countDocuments({ service: { $exists: true } });
  if (!pending) return;

  if ((await db.collection('api-categories').countDocuments()) === 0) {
    const services = await db.collection('services').find().toArray();
    const now = new Date();
    if (services.length) {
      await db.collection('api-categories').insertMany(
        services.map((service) => ({
          // Same id as the function, so every endpoint maps over directly
          _id: service._id,
          name: service.name,
          slug: service.slug,
          description: service.tagline,
          icon: service.icon,
          order: service.order ?? 0,
          createdAt: now,
          updatedAt: now,
          __v: 0,
        })),
      );
    }
    payload.logger.info(`Migration: created ${services.length} API categories from Funktioner`);
  }

  const { modifiedCount } = await db
    .collection('endpoints')
    .updateMany({ service: { $exists: true } }, [{ $set: { category: '$service' } }, { $unset: 'service' }]);
  payload.logger.info(`Migration: moved ${modifiedCount} endpoints to their API category`);
};

const migrations = [apiCategories];

export const runContentMigrations = async (payload: BasePayload) => {
  for (const migrate of migrations) await migrate(payload);
};
