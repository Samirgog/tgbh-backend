import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/repositories/base.repository';
import {Prisma, Store, StoreStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

type StoreWithDetails = Prisma.StoreGetPayload<Prisma.StoreFindUniqueArgs & {
    categories: {
      include: {
        products: {
          include: {
            parameters: true;
          };
        };
      };
    };
    paymentMethods: true;
    paymentConditions: true;
    deliveryMethods: true;
    employees: true;
    storeBot: true;
}>;

@Injectable()
export class StoreRepository extends BaseRepository<Store> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, 'store');
  }

  async create(data: any): Promise<Store> {
    const {
      categories,
      paymentMethods,
      paymentConditions,
      deliveryMethods,
      employees,
      storeBot,
      ...rest
    } = data;

    return this.prisma.store.create({
      data: {
        ...rest,
        ...(categories && {
          categories: {
            create: categories.map((category: any) => ({
              ...category,
              ...(category.products && {
                products: {
                  create: category.products.map((product: any) => ({
                    ...product,
                    ...(product.parameters && {
                      parameters: {
                        create: product.parameters,
                      },
                    })
                  })),
                },
              }),
            })),
          },
        }),
        ...(paymentMethods && {
          paymentMethods: {
            create: paymentMethods,
          },
        }),
        ...(paymentConditions && {
          paymentConditions: {
            create: paymentConditions,
          },
        }),
        ...(deliveryMethods && {
          deliveryMethods: {
            create: deliveryMethods,
          },
        }),
        ...(employees && {
          employees: {
            create: employees,
          },
        }),
        ...(storeBot && {
          storeBot: {
            create: storeBot,
          },
        }),
      },
      include: {
        categories: {
          include: {
            products: {
              include: {
                parameters: true,
              }
            },
          },
        },
        paymentMethods: true,
        paymentConditions: true,
        deliveryMethods: true,
        employees: true,
        storeBot: true,
      },
    });
  }

  async update(where: { id: string }, data: any, include?: any): Promise<Store> {
    const transformedData = this.transformNestedRelations(data);

    return this.prisma.store.update({
      where,
      data: transformedData,
      include,
    });
  }

  private transformNestedRelations(data: any): any {
    const result = { ...data };

    if (Array.isArray(data.categories)) {
      result.categories = {
        upsert: data.categories.map((category: any) => ({
          where: { id: category.id ?? '___fake_id_to_trigger_create___' },
          update: {
            name: category.name,
            priority: category.priority,
            products: Array.isArray(category.products)
                ? {
                  upsert: category.products.map((product: any) => ({
                    where: { id: product.id ?? '___fake_id_to_trigger_create___' },
                    update: {
                      name: product.name,
                      description: product.description,
                      priceAmount: product.priceAmount,
                      imageUrl: product.imageUrl,
                      imageName: product.imageName,
                      parameters: Array.isArray(product.parameters)
                          ? {
                            upsert: product.parameters.map((param: any) => ({
                              where: { id: param.id ?? '___fake_id_to_trigger_create___' },
                              update: {
                                text: param.text,
                                priceAmount: param.priceAmount,
                              },
                              create: {
                                text: param.text,
                                priceAmount: param.priceAmount,
                              },
                            })),
                          }
                          : undefined,
                    },
                    create: {
                      name: product.name,
                      description: product.description,
                      priceAmount: product.priceAmount,
                      imageUrl: product.imageUrl,
                      imageName: product.imageName,
                      parameters: Array.isArray(product.parameters)
                          ? {
                            create: product.parameters.map((param: any) => ({
                              text: param.text,
                              priceAmount: param.priceAmount,
                            })),
                          }
                          : undefined,
                    },
                  })),
                }
                : undefined,
          },
          create: {
            name: category.name,
            priority: category.priority,
            products: Array.isArray(category.products)
                ? {
                  create: category.products.map((product: any) => ({
                    name: product.name,
                    description: product.description,
                    priceAmount: product.priceAmount,
                    imageUrl: product.imageUrl,
                    imageName: product.imageName,
                    parameters: Array.isArray(product.parameters)
                        ? {
                          create: product.parameters.map((param: any) => ({
                            text: param.text,
                            priceAmount: param.priceAmount,
                          })),
                        }
                        : undefined,
                  })),
                }
                : undefined,
          },
        })),
      };
    }

    return result;
  }

  async findByOwnerId(ownerId: string): Promise<Store[]> {
    return this.findMany({ ownerId });
  }

  async findWithDetails(id: string): Promise<StoreWithDetails | null> {
    return this.findUnique(
        { id },
        {
          categories: {
            include: {
              products: {
                include: {
                  parameters: true,
                },
              },
            },
          },
          paymentMethods: true,
          paymentConditions: true,
          deliveryMethods: true,
          employees: true,
          storeBot: true,
        },
    );
  }

  async findByStatus(status: StoreStatus): Promise<Store[]> {
    return this.findMany({ status });
  }

  async findPublished(): Promise<Store[]> {
    return this.findByStatus(StoreStatus.PUBLISHED);
  }

  async findWithOrders(id: string): Promise<Store | null> {
    return this.findUnique(
      { id },
      {
        include: {
          orders: {
            include: {
              items: {
                include: {
                  product: true,
                },
              },
              statusHistory: true,
            },
          },
        },
      },
    );
  }

  async findWithEmployees(id: string): Promise<Store | null> {
    return this.findUnique(
      { id },
      {
        include: {
          employees: {
            include: {
              user: true,
            },
          },
        },
      },
    );
  }

  async findWithCategories(id: string): Promise<Store | null> {
    return this.findUnique(
      { id },
      {
        include: {
          categories: {
            include: {
              products: true,
            },
          },
        },
      },
    );
  }

  async findWithAllDetails(id: string): Promise<Store | null> {
    return this.findUnique(
      { id },
      {
        include: {
          categories: {
            include: {
              products: {
                include: {
                  parameters: true,
                },
              },
            },
          },
          paymentMethods: true,
          paymentConditions: true,
          deliveryMethods: true,
          employees: {
            include: {
              user: true,
            },
          },
          storeBot: true,
          orders: {
            include: {
              items: {
                include: {
                  product: true,
                },
              },
              statusHistory: true,
            },
          },
        },
      },
    );
  }
}
