import Troller from '../models/Troller';
import User from '../models/User';
import CreateOrderSellerService from '../services/OrderSeller.service';
import { responseLog } from './Logs';

async function create(seller: User, troller: Troller) {
  try {
    const service = new CreateOrderSellerService();

    const orderNumber = getOrderNumber();

    await service.execute({ orderNumber, troller, seller });
    responseLog(undefined, {
      orderItems: 'Relation between order and seller succeeded.',
    });
  } catch (error) {
    responseLog(error);
    throw error;
  }
}

function getOrderNumber() {
  const first = Math.floor(Math.random() * 1000);
  const second = Math.floor(Math.random() * 100000);
  const third = Math.floor(Math.random() * 1000);
  const date = Date.now();
  return `${first}-${second}-${third}-${date}`;
}

export { create };
