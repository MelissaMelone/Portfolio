"use strict"

import KleintiereService from "../service/kleintiere.service.js";
import {wrapHandler} from "../utils.js";
import RestifyError from "restify-errors";

/**
 * HTTP-Controller-Klasse für Kleintiereinträge. Diese Klasse registriert
 * alle notwendigen URL-Handler beim Webserver zum Lesen und Schreiben von Kleintierdaten.
 */
export default class KleintiereController {
    
    constructor(server, prefix) {
        this._service = new KleintiereService();
        this._prefix = prefix;

        // Collection: Kleintiere
        server.get(prefix, wrapHandler(this, this.search));
        server.post(prefix, wrapHandler(this, this.create));

        // Entity: Kleintier
        server.get(prefix + "/:id", wrapHandler(this, this.read));
        server.put(prefix + "/:id", wrapHandler(this, this.update));
        server.patch(prefix + "/:id", wrapHandler(this, this.update));
        server.del(prefix + "/:id", wrapHandler(this, this.delete));
    }


    //Einfügen von HATEOAS-Links in einen Datensatz.

    _insertHateoasLinks(entity) {
        let url = `${this._prefix}/${entity._id}`;

        entity._links = {
            read:   {url: url, method: "GET"},
            update: {url: url, method: "PUT"},
            patch:  {url: url, method: "PATCH"},
            delete: {url: url, method: "DELETE"},
        }
    }

    //GET /kleintiere
     
    async search(req, res, next) {
        let result = await this._service.search(req.query);
        result.forEach(entity => this._insertHateoasLinks(entity));
        res.sendResult(result);
        return next();
    }

    //POST /kleintiere

    async create(req, res, next) {
        let result = await this._service.create(req.body);
        this._insertHateoasLinks(result);

        res.status(201);
        res.header("Location", `${this._prefix}/${result._id}`);
        res.sendResult(result);

        return next();
    }


    //GET /kleintiere/:id

    async read(req, res, next) {
        let result = await this._service.read(req.params.id);
        this._insertHateoasLinks(result);

        if (result) {
            res.sendResult(result);
        } else {
            throw new RestifyError.NotFoundError("Kleintier nicht gefunden");
        }

        return next();
    }


    //PUT /kleintiere/:id
    //PATCH /kleintiere/:id

    async update(req, res, next) {
        let result = await this._service.update(req.params.id, req.body);
        this._insertHateoasLinks(result);

        if (result) {
            res.sendResult(result);
        } else {
            throw new RestifyError.NotFoundError("Kleintier nicht gefunden");
        }

        return next();
    }

    
    //DELETE /kleintiere/:id

    async delete(req, res, next) {
        await this._service.delete(req.params.id)
        res.status(204);
        res.sendResult({});
        return next();
    }
}
