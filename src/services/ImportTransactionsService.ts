import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
import { getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import csvUploadConfig from '../config/csvUpload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';

interface CSVLine {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category_title: string;
}

interface Request {
  filename: string;
}

class ImportTransactionsService {
  async execute({ filename }: Request): Promise<Transaction[]> {
    const csvFilePath = path.resolve(csvUploadConfig.directory, filename);

    const readCSVStream = fs.createReadStream(csvFilePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const parsedLines: CSVLine[] = [];

    parseCSV.on('data', line => {
      const parsedLine: CSVLine = {
        title: line[0],
        type: line[1],
        value: Number(line[2]),
        category_title: line[3],
      };

      parsedLines.push(parsedLine);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const categories: string[] = parsedLines.map(line => line.category_title);

    const uniqueCategories = categories.reduce((prevArray: string[], title) => {
      const titleIndex = prevArray.findIndex(category => category === title);

      if (titleIndex < 0) {
        prevArray.push(title);
      }

      return prevArray;
    }, []);

    const categoriesIds = new Map();
    // eslint-disable-next-line no-restricted-syntax
    for (const title of uniqueCategories) {
      // eslint-disable-next-line no-await-in-loop
      const category = await categoriesRepository.findOrinsertIfNotExists(
        title,
      );

      categoriesIds.set(title, category);
    }

    const transactions = parsedLines.map(line => {
      const { title, type, value, category_title } = line;

      const transaction: Transaction = {
        title,
        type,
        value,
        category_id: categoriesIds.get(category_title),
      };

      return transaction;
    });

    await transactionsRepository.insert(transactions);

    fs.promises.unlink(csvFilePath);

    return transactions;
  }
}

export default ImportTransactionsService;
