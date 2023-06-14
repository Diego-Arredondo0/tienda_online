const { Router } = require('express');
const router = Router();

const { renderFormRegistro, 
        renderFormInicioSesion, 
        inicioSesion, 
        registro, 
        cerrarSesion
      } = require('../controllers/users.controller')

router.get('/users/signup', renderFormRegistro);
router.post('/users/signup', registro);

router.get('/users/signin', renderFormInicioSesion);
router.post('/users/signin', inicioSesion);

router.get('/users/logout', cerrarSesion);


module.exports = router;