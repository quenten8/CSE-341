import { Request, Response } from 'express';
import { validationResult, body } from 'express-validator';
import { ObjectId } from 'mongodb';
import dbConnect from './db_connect';

export const getAllRecipes = async (req: Request, res: Response) => {
  try {
    const recipes = await dbConnect.getDb().db().collection('recipes').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(recipes, null, 2));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: (error as Error).message });
  }
};

export const getRecipe = async (req: Request, res: Response) => {
  try {
    console.log('Received recipe data:', req.body);

    const recipeId = new ObjectId(req.params.id);

    if (!ObjectId.isValid(recipeId)) {
      return res.status(400).json({ message: 'Invalid recipe ID' });
    }

    const recipe = await dbConnect.getDb().db().collection('recipes').findOne({ _id: recipeId });

    if (recipe) {
      res.status(200).json(recipe);
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: (error as Error).message });
  }
};

export const addRecipe = async (req, res, next) => {
  try {
    console.log('Received recipe data:', req.body);

    const { title, description, ingredients, instructions, time, servingSize, dateAdded = Date() } = req.body;

    // Data validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!title || !description || !ingredients) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Insert recipe into database
    const result = await dbConnect.getDb().db().collection('recipes').insertOne({
      title,
      description,
      ingredients,
      instructions,
      time,
      servingSize,
      dateAdded,
    });

    res.status(201).json({ id: result.insertedId });
  } catch (error) {
    next(error);
  }
};

export const changeRecipe = async (req, res, next) => {
  try {
    const recipeId = new ObjectId(req.params.id);
    const { title, description, ingredients, instructions, time, servingSize, dateAdded = Date() } = req.body;

    // Data validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!title || !description || !ingredients) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Update recipe in the database
    const result = await dbConnect.getDb().db().collection('recipes').updateOne(
      { _id: recipeId },
      {
        $set: {
          title,
          description,
          ingredients,
          instructions,
          time,
          servingSize,
          dateAdded,
        },
      }
    );

    if (result.matchedCount === 1) {
      res.status(200).json({ message: 'Recipe updated' });
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteRecipe = async (req: Request, res: Response) => {
  try {
    const recipeId = new ObjectId(req.params.id);
    const result = await dbConnect.getDb().db().collection('recipes').deleteOne({ _id: recipeId });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Recipe deleted' });
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: (error as Error).message });
  }
};

export const deleteAll = async (req: Request, res: Response) => {
  try {
    const result = await dbConnect.getDb().db().collection('recipes').deleteMany({});

    res.status(200).json({ message: 'All recipes deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: (error as Error).message });
  }
};
