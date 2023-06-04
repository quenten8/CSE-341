"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAll = exports.deleteRecipe = exports.changeRecipe = exports.addRecipe = exports.getRecipe = exports.getAllRecipes = void 0;
const express_validator_1 = require("express-validator");
const mongodb_1 = require("mongodb");
const db_connect_1 = __importDefault(require("./db_connect"));
const getAllRecipes = async (req, res) => {
    try {
        const recipes = await db_connect_1.default.getDb().db().collection('recipes').find().toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(recipes, null, 2));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
exports.getAllRecipes = getAllRecipes;
const getRecipe = async (req, res) => {
    try {
        console.log('Received recipe data:', req.body);
        const recipeId = new mongodb_1.ObjectId(req.params.id);
        if (!mongodb_1.ObjectId.isValid(recipeId)) {
            return res.status(400).json({ message: 'Invalid recipe ID' });
        }
        const recipe = await db_connect_1.default.getDb().db().collection('recipes').findOne({ _id: recipeId });
        if (recipe) {
            res.status(200).json(recipe);
        }
        else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
exports.getRecipe = getRecipe;
const addRecipe = async (req, res, next) => {
    try {
        console.log('Received recipe data:', req.body);
        const { title, description, ingredients, instructions, time, servingSize, dateAdded = Date() } = req.body;
        // Data validation
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        if (!title || !description || !ingredients) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        // Insert recipe into database
        const result = await db_connect_1.default.getDb().db().collection('recipes').insertOne({
            title,
            description,
            ingredients,
            instructions,
            time,
            servingSize,
            dateAdded,
        });
        res.status(201).json({ id: result.insertedId });
    }
    catch (error) {
        next(error);
    }
};
exports.addRecipe = addRecipe;
const changeRecipe = async (req, res, next) => {
    try {
        const recipeId = new mongodb_1.ObjectId(req.params.id);
        const { title, description, ingredients, instructions, time, servingSize, dateAdded = Date() } = req.body;
        // Data validation
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        if (!title || !description || !ingredients) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        // Update recipe in the database
        const result = await db_connect_1.default.getDb().db().collection('recipes').updateOne({ _id: recipeId }, {
            $set: {
                title,
                description,
                ingredients,
                instructions,
                time,
                servingSize,
                dateAdded,
            },
        });
        if (result.matchedCount === 1) {
            res.status(200).json({ message: 'Recipe updated' });
        }
        else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.changeRecipe = changeRecipe;
const deleteRecipe = async (req, res) => {
    try {
        const recipeId = new mongodb_1.ObjectId(req.params.id);
        const result = await db_connect_1.default.getDb().db().collection('recipes').deleteOne({ _id: recipeId });
        if (result.deletedCount === 1) {
            res.status(200).json({ message: 'Recipe deleted' });
        }
        else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
exports.deleteRecipe = deleteRecipe;
const deleteAll = async (req, res) => {
    try {
        const result = await db_connect_1.default.getDb().db().collection('recipes').deleteMany({});
        res.status(200).json({ message: 'All recipes deleted' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
exports.deleteAll = deleteAll;
