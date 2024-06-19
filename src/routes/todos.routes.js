import express from 'express';
import passport from 'passport';
import { todosController } from '../controllers/todos.controller.js';

export const todosRouter = express.Router();

todosRouter.get('/:categoryId', passport.authenticate('jwt', { session: false }), todosController.getByCategoryId);
todosRouter.post('/', passport.authenticate('jwt', { session: false }), todosController.create);
todosRouter.put('/:id', todosController.update);
todosRouter.delete('/:id', todosController.remove);