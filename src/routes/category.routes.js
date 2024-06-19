import express from 'express';
import passport from 'passport';
import { caregoryController } from '../controllers/category.controller.js';


export const categoryRouter = express.Router();

categoryRouter.get('/', passport.authenticate('jwt', { session: false }), caregoryController.getAll);
categoryRouter.get('/:id', passport.authenticate('jwt', { session: false }), caregoryController.getById);
categoryRouter.post('/', passport.authenticate('jwt', { session: false }), caregoryController.create);
categoryRouter.put('/:id', passport.authenticate('jwt', { session: false }), caregoryController.update);
categoryRouter.delete('/:id', passport.authenticate('jwt', { session: false }), caregoryController.remove);
