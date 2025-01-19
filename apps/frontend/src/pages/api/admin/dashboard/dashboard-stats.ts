import Order from '@/models/Order.ts';
import Product from '@/models/Product.ts';
import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';
import Setting from '@/models/Setting.ts';

export const GET: APIRoute = async ({ request, url, params }) => {
  const searchParams = new URL(request.url).searchParams;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!startDate || !endDate) {
    return response({}, 'Missing required fields', 400);
  }

  const filterByDateRange = {
    createdAt: {
      $gte: new Date(startDate),
      $lt: new Date(endDate),
    },
  };

  try {
    const [
      topSellingProductStats,
      dashboardOrderCount,
      totalSalesAmount,
      graphDataForSalePerDay,
      PerProductSold,
    ] = await Promise.all([
      getTopSellingProductStats(filterByDateRange),
      getDashboardOrderCount(filterByDateRange),
      getTotalSalesAmount(filterByDateRange),
      getGraphDataForSalePerDay(filterByDateRange),
      getPerProductSold(filterByDateRange),
    ]);

    return response(
      {
        topSellingProductStats,
        dashboardOrderCount,
        totalSalesAmount,
        graphDataForSalePerDay,
        PerProductSold,
      },
      'Dashboard stats retrieved successfully',
      200,
    );
  } catch (err) {
    console.error(err);
    return response({}, 'Internal Server Error!', 500);
  }
};

async function getTopSellingProductStats(filterByDateRange) {
  const topSellingProductStats = await Product.aggregate([
    { $match: filterByDateRange },
    {
      $project: {
        name: 1,
        totalPurchased: 1,
      },
    },
    { $sort: { totalPurchased: -1 } },
    { $limit: 3 },
  ]);

  return topSellingProductStats;
}

async function getDashboardOrderCount(filterByDateRange) {
  let orderCounts = await Order.aggregate([
    { $match: filterByDateRange },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        total: { $sum: '$total' },
      },
    },
  ]);

  orderCounts = orderCounts?.reduce((acc, cur) => {
    acc[cur._id] = {
      count: cur.count,
      total: cur.total,
    };

    return acc;
  }, {});

  const total = Object.values(orderCounts).reduce(
    (acc, cur) => {
      acc.count += cur.count;
      acc.total += cur.total;
      return acc;
    },
    { count: 0, total: 0 },
  );

  return { ...orderCounts, total };
}

async function getTotalSalesAmount(filterByDateRange) {
  const result = await Order.aggregate([
    { $match: filterByDateRange },
    {
      $group: {
        _id: null,
        totalSalePrice: { $sum: '$total' },
      },
    },
  ]);

  return result.length > 0 ? result[0].totalSalePrice : 0;
}

async function getGraphDataForSalePerDay(filterByDateRange) {
  const siteSetting = await Setting.findOne({}, { timeZone: 1 });
  const timeZone = Number(siteSetting?.timeZone || 0);

  const graphData = await Order.aggregate([
    { $match: filterByDateRange },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: {
              $dateAdd: {
                startDate: '$createdAt',
                unit: 'hour',
                amount: timeZone,
              },
            },
          },
        },
        totalSales: { $sum: '$total' },
        date: { $first: '$createdAt' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return graphData;
}

async function getPerProductSold(filterByDateRange) {
  const productSold = await Order.aggregate([
    { $match: filterByDateRange },
    {
      $project: {
        cartItems: 1,
      },
    },
    { $unwind: '$cartItems' },
    {
      $group: {
        _id: '$cartItems._id',
        totalPurchased: { $sum: '$cartItems.quantity' },
        name: { $first: '$cartItems.name' },
        image: { $first: '$cartItems.image' },
        totalSalePrice: { $sum: '$cartItems.salePrice' },
      },
    },
  ]);

  return productSold;
}
