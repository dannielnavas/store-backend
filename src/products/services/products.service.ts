import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  CreateProductDto,
  FilterProductsDto,
  UpdateProductDto,
} from '../dtos/products.dto';
import { Product } from '../entities/products.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  findAll(params?: FilterProductsDto) {
    if (params) {
      const filters: FilterQuery<Product> = {};
      const { limit, offset } = params;
      const { minPrice, maxPrice } = params;
      if (minPrice && maxPrice) {
        // TODO: gte es mayor e igual
        // TODO: lte es menor e igual
        filters.price = { $gte: minPrice, $lte: maxPrice };
      }
      // return this.productModel.find(filters).populate('brand').skip(offset).limit(limit).exec();
      return this.productModel.find(filters).skip(offset).limit(limit).exec();
    }
    // TODO: populate es para traer los datos de la relacion, hace un join hacia la coleccion de brand y trae el objeto completo
    // return this.productModel.find().populate('brand').exec();
    return this.productModel.find().exec();
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      // TODO: manejo de errores el throw new error es 500
      // throw new Error(`Product ${id} not found`);
      // TODO: manejo de errores el throw new NotFoundException es 404
      throw new NotFoundException(`Product ${id} not found`);
    }
    return product;
  }

  create(payload: CreateProductDto) {
    const newProduct = new this.productModel(payload);
    return newProduct.save();
  }

  update(id: string, payload: UpdateProductDto) {
    const product = this.productModel
      .findByIdAndUpdate(id, { $set: payload }, { new: true })
      .exec();
    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }
    return product;
  }

  // delete(id: number) {
  //   const product = this.products.find((item) => item.id === id);
  //   if (!product) {
  // TODO: manejo de errores el throw new error es 500
  // throw new Error(`Product ${id} not found`);
  // TODO: manejo de errores el throw new NotFoundException es 404
  //     throw new NotFoundException(`Product ${id} not found`);
  //   }
  //   return this.products.filter((item) => item.id !== id);
  // }

  delete(id: string) {
    return this.productModel.findByIdAndDelete(id);
  }
}
