import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async findOrinsertIfNotExists(title: string): Promise<Category> {
    const findCategory = await this.findOne({
      where: { title },
    });

    let category;

    if (!findCategory) {
      category = this.create({
        title,
      });

      await this.save(category);

      return category;
    }

    return findCategory;
  }
}

export default CategoriesRepository;
