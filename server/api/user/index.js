'use strict';

import express from 'express';
import controller from './user.controller';
import auth from '../../auth/auth.service';

var router = express.Router();


// router.param('id', auth.hasRole('admin'), controller.showParams);
// router.param('id', controller.showParams);


router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.use('/my/campaigns', auth.isAuthenticated(), controller.meParams, require('../campaign'));
router.use('/my/comments', auth.isAuthenticated(), controller.meParams, require('../comment'));
router.use('/my/followings', auth.isAuthenticated(), controller.meParams, require('../follower'));
router.use('/my/volunteering', auth.isAuthenticated(), controller.meParams, require('../volunteer'));
router.use('/my/contributions', auth.isAuthenticated(), controller.meParams, require('../contributor'));
router.get('/:id', auth.isAuthenticated(), controller.show);
router.put('/:id/profile_pic', auth.isAuthenticated(), controller.changeProfilePic);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.post('/', controller.create);

module.exports = router;
