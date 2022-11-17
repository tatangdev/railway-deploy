const express = require('express');
const router = express();
const handler = require('../handlers');
const { User, Sequelize } = require('../models');
const Op = Sequelize.Op;

router.get('/', async (req, res, next) => {
    try {
        let query = {};

        const search = req.query.search;
        if (search) {
            console.log(search);
            query = {
                where: {
                    [Op.or]: [
                        {
                            name: {
                                [Op.like]: `%${search}%`
                            }
                        },
                        {
                            email: {
                                [Op.like]: `%${search}%`
                            }
                        }
                    ]
                }
            };
        }

        const users = await User.findAll(query);
        if (!users.length) {
            return res.status(200).json({
                status: true,
                message: 'empty data',
                data: null
            });
        }

        return res.status(200).json({
            status: true,
            message: 'success',
            data: users
        });

    } catch (err) {
        next(err);
    }
});

router.get('/auth/register', handler.auth.signUp);
router.post('/auth/register', handler.auth.register);

router.get('/auth/login', handler.auth.signIn);
router.post('/auth/login', handler.auth.login);

router.get('/auth/forgot-password', handler.auth.forgotPasswordView);
router.post('/auth/forgot-password', handler.auth.forgotPassword);

router.get('/auth/reset-password', handler.auth.resetPasswordView);
router.post('/auth/reset-password', handler.auth.resetPassword);

module.exports = router;

/**
 * 100 data di database
 * 1 page = 20 product
 * halaman 1 : limit 20, offset 0  => 1  - 20
 * halaman 2 : limit 20, offset 20 => 21 - 40
 * halaman 3 : limit 20, offset 40 => 41 - 60
 * halaman 4 : limit 20, offset 60 => 61 - 80
 * halaman 5 : limit 20, offset 80 => 81 - 100
 
 items : 100
 pages: 5
 page: 2
 next_page: http://localhost:3000?page=3
 prev_page: http://localhost:3000?page=1
 */