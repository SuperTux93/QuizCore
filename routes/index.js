var express = require('express');
var multer = require('multer');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var userController = require('../controllers/user_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' , errors: []});
});

//Autoload de comando con :quizId
router.param('quizId', quizController.load); 		//autoload :quizId
router.param('commentId', commentController.load); 	//autoload :commentId
router.param('userId', userController.load);		//autoload :userId

//Definicion de rutas de sesion
router.get('/login',	sessionController.new); 	// formulario login
router.post('/login',	sessionController.create);	// crear sesion
router.get('/logout',	sessionController.destroy);	// destruir sesion

//Definicion de rutas de cuetna
router.get('/user', userController.new); 			//formulario sign in
router.post('/user', userController.create); 		//registra usuario
router.get('/user/:userId(\\d+)/edit', 	sessionController.loginRequired, userController.ownershipRequired, userController.edit);
router.put('/user/:userId(\\d+)', 		sessionController.loginRequired, userController.ownershipRequired, userController.update);
router.delete('/user/:userId(\\d+)',	sessionController.loginRequired, userController.ownershipRequired, userController.destroy);
router.get('/user/:userId(\\d+)/quizes',	quizController.index);


//Definicion de rutas de /quizes
router.get('/quizes', 						quizController.index);
router.get('/quizes/:quizId(\\d+)', 		quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', 	quizController.answer);
router.get('/quizes/new',					sessionController.loginRequired, quizController.new);
router.post('/quizes/create',				sessionController.loginRequired,			
											multer({ dest: './public/media/'}),	
											quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',	sessionController.loginRequired, quizController.ownershipRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)', 		sessionController.loginRequired, 
											quizController.ownershipRequired, 
											multer({ dest: './public/media/'}),	
											quizController.update);
router.delete('/quizes/:quizId(\\d+)',		sessionController.loginRequired, quizController.ownershipRequired, quizController.destroy);

//Definicion de rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new',	commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',		commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.loginRequired, commentController.ownershipRequired, commentController.publish);

//Definicion de ruta de estadisticas de quizes
router.get('/quizes/statistics',			quizController.statistics);

module.exports = router;
