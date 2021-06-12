import { getCustomRepository } from 'typeorm';
import Product from '../models/Product';
import ProductRepository from '../repositories/Product.repository';
import CreateProductService, {
  ProductRequest,
} from '../services/Product.service';
import { getOne as getFair } from './Fair';
import { responseLog } from './Logs';

async function getAll() {
  try {
    const productRepository = getCustomRepository(ProductRepository);

    const products = await productRepository.find();

    responseLog(undefined, products);
    return { status: 200, products };
  } catch (err) {
    responseLog(err);
    return { status: 400, error: err.message };
  }
}

async function getByFair(fairId: string) {
  try {
    const productRepository = getCustomRepository(ProductRepository);

    const products = await productRepository.find({
      relations: ['fair'],
      where: { fair: { id: fairId } },
    });

    responseLog(undefined, products);
    return { status: 200, products };
  } catch (err) {
    responseLog(err);
    return { status: 400, error: err.message };
  }
}

async function create(fairId: string, body: ProductRequest) {
  try {
    const productService = new CreateProductService();
    const { fair } = await getFair(fairId);

    if (!fair) {
      const err = new Error(`Fair id ${fairId} not found!`);
      responseLog(err);
      return { status: 400, error: err.message };
    }

    const product = await productService.execute({ ...body }, fair);

    responseLog(undefined, product);
    return { status: 200, product };
  } catch (err) {
    responseLog(err);
    return { status: 400, error: err.message };
  }
}

async function getOne(id: string) {
  try {
    const repository = getCustomRepository(ProductRepository);
    const product = await repository.findOne({ where: { id } });

    if (!product) {
      const err = new Error(`Product ${id} not found.`);
      responseLog(err);
      return { status: 501, error: err.message };
    }

    responseLog(undefined, product);
    return { status: 200, product };
  } catch (err) {
    responseLog(err);
    return { status: 400, error: err.message };
  }
}

async function update(id: string, body: Partial<Product> | Product) {
  try {
    const productRepository = getCustomRepository(ProductRepository);

    await productRepository.update(id, {
      ...body,
    });

    const updateProduct = await productRepository.findOne({ id });

    responseLog();
    return { status: 200, product: updateProduct };
  } catch (err) {
    responseLog(err);
    return { status: 400, error: err.message };
  }
}

async function remove(id: string) {
  try {
    const productRepository = getCustomRepository(ProductRepository);
    await productRepository.delete(id);

    responseLog(undefined, { product: `Product ${id} deleted` });
    return { status: 204 };
  } catch (err) {
    responseLog(err);
    return { status: 400, error: err.message };
  }
}

export { getAll, getByFair, create, getOne, update, remove };
