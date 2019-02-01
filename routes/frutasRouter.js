
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const {ListaFrutas} = require('./../models/frutasModel');

let jsonParser = bodyParser.json();

router.get('/lista-frutas', jsonParser, (req, res) => {
	res.json(ListaFrutas.obtener());
});

router.post('/lista-frutas', jsonParser, (req, res) => {
	console.log(req.body);

	const camposRequeridos = ['nombre', 'id'];

	for (let i = 0; i < camposRequeridos.length; i ++){
		if (!(camposRequeridos[i] in req.body)){
			console.log(`Falta el campo ${camposRequeridos[i]}`);
			return res.status(400).send(`Falta el campo ${camposRequeridos[i]}`);
		}
	}

	let promise = new Promise(function(resolve, reject){
		ListaFrutas.crear(resolve, reject, {
								id : req.body.id,
								nombre: req.body.nombre
							});
	})
	.then( resultado => {
		res.status(201).json(resultado);
	}).
	catch (err => {
		return res.status(400).send(`Occurió algo inesperado ${err}`);
	})
});

router.put('/lista-frutas/:id/:nombre', jsonParser, (req, res) => {
	let idParam = req.params._id;
	let idBody = req.body._id;

	if(idParam && idBody && idParam == idBody){
		let promise = new Promise(function ( resolve, reject){
			let frutaActualizada = {
				nombre : req.body.nombre,
				id : req.body.id
			}
			ListaFrutas.actualizar(resolve, reject, idParam, frutaActualizada)
		})
		.then(resultado => {
			res.status(204).end();
		})
		.catch(err  => {
			res.status(500).json(err);
		})
	}
	else{
		res.status(400).json({error : "Id no coincide "})
	}
	// for ( let i = 0; i < listaFrutas.length; i ++){
	// 	if ( listaFrutas[i].id == id ){
	// 		listaFrutas[i].nombre = nombre;
	// 		res.status(204).end();
	// 	}
	// }

	return res.status(400).send("Id no se encontró en la lista");

});

router.delete('/lista-frutas/:id', jsonParser, (req, res) => {

	if( req.params.id == req.body.id ){
		for ( let i = 0; i < listaFrutas.length; i ++ ){
			if ( req.params.id == listaFrutas[i].id){
				listaFrutas.splice(i, 1);
				res.status(204).end();
			}
		}
		return res.status(400).send("Id no se encontró en la lista");
	}
	else{
		return res.status(400).send('El parametro no coincide con el body');
	}

});


module.exports = {
	router
};




