"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAll = exports.deleteRecipe = exports.addRecipe = exports.getRecipe = exports.getAllRecipes = void 0;
const { ObjectId } = require('mongodb');
const dbConnect = require('./db_connect');
const getAllRecipes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipes = yield dbConnect.getDb().db().collection('recipes').find().toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(recipes, null, 2));
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        console.log(error);
    }
});
exports.getAllRecipes = getAllRecipes;
const getRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipeId = new ObjectId(req.params.id);
        const recipe = yield dbConnect.getDb().db().collection('recipes').findOne({ _id: recipeId });
        if (recipe) {
            res.status(200).json(recipe);
        }
        else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.getRecipe = getRecipe;
const addRecipe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, ingredients, instructions, time, servingSize, dateAdded } = req.body;
        // Check if all required fields are provided
        if (!title || !description || !ingredients || !instructions || !time || !servingSize || !dateAdded) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }
        // Insert the recipe into the database
        const result = yield dbConnect.getDb().db().collection('recipes').insertOne(req.body);
        res.status(201).json({ id: result.insertedId });
    }
    catch (error) {
        next(error);
    }
});
exports.addRecipe = addRecipe;
const deleteRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipeId = new ObjectId(req.params.id);
        const result = yield dbConnect.getDb().db().collection('recipes').deleteOne({ _id: recipeId });
        if (result.deletedCount === 1) {
            res.status(200).json({ message: 'Recipe deleted' });
        }
        else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.deleteRecipe = deleteRecipe;
const deleteAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield dbConnect.getDb().db().collection('recipes').deleteMany({});
        res.status(200).json({ message: 'All recipes deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.deleteAll = deleteAll;
