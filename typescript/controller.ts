import { Request, Response } from 'express';
const { ObjectId } = require('mongodb');
const dbConnect = require('./db_connect');

export const getAllRecipes = async (req: Request, res: Response) => {
    try {
        const recipes = await dbConnect.getDb().db().collection('recipes').find().toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(recipes, null, 2));
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        console.log(error)
    }
};

export const getRecipe = async (req: Request, res: Response) => {
    try {
        const recipeId = new ObjectId(req.params.id);
        const recipe = await dbConnect.getDb().db().collection('recipes').findOne({ _id: recipeId });

        if (recipe) {
            res.status(200).json(recipe);
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const addRecipe = async (req, res, next) => {
    try {
      const { title, description, ingredients, instructions, time, servingSize, dateAdded } = req.body;
      
      // Check if all required fields are provided
      if (!title || !description || !ingredients || !instructions || !time || !servingSize || !dateAdded) {
        res.status(400).json({ message: 'All fields are required' });
        return;
      }      
      // Insert the recipe into the database
      const result = await dbConnect.getDb().db().collection('recipes').insertOne(req.body);
      
      res.status(201).json({ id: result.insertedId });
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
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const deleteAll = async (req: Request, res: Response) => {
    try {
        const result = await dbConnect.getDb().db().collection('recipes').deleteMany({});

        res.status(200).json({ message: 'All recipes deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
